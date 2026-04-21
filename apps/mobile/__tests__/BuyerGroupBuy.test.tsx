import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import GroupBuyListScreen from '../src/app/buyer/group-buys/index';
import GroupBuyDetailScreen from '../src/app/buyer/group-buys/[groupBuyId]';

const mockUseLocalSearchParams = jest.fn();
const mockUseRouter = jest.fn(() => ({
  push: jest.fn(),
  back: jest.fn(),
}));

jest.mock('expo-router', () => ({
  Stack: {
    Screen: () => null,
  },
  useRouter: () => mockUseRouter(),
  useLocalSearchParams: () => mockUseLocalSearchParams(),
}));

jest.mock('@fosholhaat/tokens/tokens.json', () => ({
  color: {
    canvas: '#F8FAF9',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textBody: '#404941',
    borderSoft: '#E2E8F0',
    progressTrack: '#E8EFEA',
  },
  brand: {
    primary: '#1A5632',
  },
  alert: {
    live: '#E11D48',
  },
}));

describe('BuyerGroupBuy screens', () => {
  beforeEach(() => {
    mockUseLocalSearchParams.mockReset();
  });

  it('renders the list screen', () => {
    mockUseLocalSearchParams.mockReturnValue({});
    let tree: renderer.ReactTestRenderer | null = null;
    act(() => {
      tree = renderer.create(<GroupBuyListScreen />);
    });
    expect((tree as unknown as renderer.ReactTestRenderer).toJSON()).toBeDefined();
  });

  it('renders the detail screen for a known route param', () => {
    mockUseLocalSearchParams.mockReturnValue({ groupBuyId: 'gb-1' });
    let tree: renderer.ReactTestRenderer | null = null;
    act(() => {
      tree = renderer.create(<GroupBuyDetailScreen />);
    });
    expect((tree as unknown as renderer.ReactTestRenderer).toJSON()).toBeDefined();
  });

  it('shows not found when the route param does not match a group buy', () => {
    mockUseLocalSearchParams.mockReturnValue({ groupBuyId: 'missing' });

    let tree: renderer.ReactTestRenderer;
    act(() => {
      tree = renderer.create(<GroupBuyDetailScreen />);
    });

    const textValues = tree!.root.findAllByType(Text).map((node) => node.props.children).flat();
    expect(textValues).toEqual(expect.arrayContaining(['ডিল পাওয়া যায়নি', 'এই গ্রুপ বাই এখন আর নেই।']));
  });
});
