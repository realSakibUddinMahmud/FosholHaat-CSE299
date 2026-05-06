import 'react-native-gesture-handler/jestSetup';

// Mock essential native modules
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
jest.mock('react-native/Libraries/Components/Keyboard/Keyboard', () => {
  const keyboard = {
    addListener: jest.fn(() => ({ remove: jest.fn() })),
    removeListener: jest.fn(),
    removeAllListeners: jest.fn(),
    dismiss: jest.fn(),
    isVisible: jest.fn(() => false),
    metrics: jest.fn(() => undefined),
  };

  return {
    __esModule: true,
    default: keyboard,
    ...keyboard,
  };
});

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Link: ({ children }: any) => children,
}));

jest.mock('expo-status-bar', () => ({
  StatusBar: () => null,
}));

jest.mock('@expo/vector-icons', () => {
  const React = require('react');
  const { Text } = require('react-native');

  const Icon = ({ name }: { name?: string }) => React.createElement(Text, null, name ?? 'icon');

  return {
    MaterialIcons: Icon,
  };
});

jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    SafeAreaProvider: ({ children }: any) => children,
    SafeAreaView: ({ children, ...props }: any) => React.createElement(View, props, children),
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});
jest.mock("expo-constants", () => ({ expoConfig: { hostUri: "localhost:19000" } }));
jest.mock("expo-image-picker", () => ({
  requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
  launchImageLibraryAsync: jest.fn(() => Promise.resolve({ canceled: true, assets: [] })),
  MediaTypeOptions: { Images: "Images" },
}));
jest.mock("expo-print", () => ({ printToFileAsync: jest.fn(() => Promise.resolve({ uri: "file://handoff.pdf" })) }));
jest.mock("expo-sharing", () => ({ isAvailableAsync: jest.fn(() => Promise.resolve(true)), shareAsync: jest.fn(() => Promise.resolve()) }));
jest.mock("expo-camera", () => {
  const React = require("react");
  const { View } = require("react-native");
  return {
    CameraView: (props: any) => React.createElement(View, props),
    useCameraPermissions: () => [{ granted: false }, jest.fn()],
  };
});
jest.mock("qrcode", () => ({
  __esModule: true,
  default: { toDataURL: jest.fn(() => Promise.resolve("data:image/png;base64,qr")) },
  toDataURL: jest.fn(() => Promise.resolve("data:image/png;base64,qr")),
}));

jest.mock('@react-native-async-storage/async-storage', () => {
  const store: Record<string, string> = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn((key: string) => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key: string, value: string) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn((key: string) => {
        delete store[key];
        return Promise.resolve();
      }),
    },
  };
});
