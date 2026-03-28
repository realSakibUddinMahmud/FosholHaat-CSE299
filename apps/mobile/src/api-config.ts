import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Returns the base API URL based on the current environment.
 */
export const getApiUrl = () => {
  if (__DEV__) {
    // Standard android emulator localhost is 10.0.2.2
    if (Platform.OS === 'android') {
      const debuggerHost = Constants.expoConfig?.hostUri;
      if (debuggerHost) {
        const localhost = debuggerHost.split(':').shift();
        return `http://${localhost}:3000`;
      }
      return 'http://10.0.2.2:3000';
    }

    // For iOS and Web in development
    const debuggerHost = Constants.expoConfig?.hostUri;
    if (debuggerHost) {
      const localhost = debuggerHost.split(':').shift();
      return `http://${localhost}:3000`;
    }
    return 'http://localhost:3000';
  }

  // Blocker: Production API host is not yet established.
  // Physical device testing in staging/prod requires explicit infra approval.
  return ''; 
};
