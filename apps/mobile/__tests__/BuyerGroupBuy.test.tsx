import React from 'react';
import renderer, { act } from 'react-test-renderer';
import { Text } from 'react-native';
import GroupBuyListScreen from '../src/app/buyer/group-buys/index';
import GroupBuyDetailScreen from '../src/app/buyer/group-buys/[groupBuyId]';
import type { GroupBuyDetail, GroupBuySummary } from '@fosholhaat/types';

const MOCK_GROUP_BUYS: GroupBuySummary[] = [{
  id: 'gb-1',
  productId: 'p-1',
  productName: { bn: 'পেঁয়াজ', en: 'Onion' },
  productImage: 'https://example.com/onion.jpg',
  unitPrice: 45,
  groupPrice: 40,
  targetQuantity: 1000,
  currentQuantity: 150,
  deadline: '2026-05-12T00:00:00.000Z',
  status: 'ACTIVE',
  participantCount: 1,
  unit: { bn: 'kg', en: 'kg' },
}];

const MOCK_GROUP_BUY_DETAIL: GroupBuyDetail = {
  ...MOCK_GROUP_BUYS[0],
  description: { bn: 'DB lot', en: 'DB lot' },
  sellerName: 'Seller',
  minimumJoinQuantity: 50,
  maximumJoinQuantity: 500,
};

const mockUseLocalSearchParams = jest.fn();
const mockApiFetch = jest.fn();
const mockApiPost = jest.fn();
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

jest.mock('../src/lib/api-client', () => ({
  apiFetch: (...args: unknown[]) => mockApiFetch(...args),
  apiPost: (...args: unknown[]) => mockApiPost(...args),
}));

jest.mock('@fosholhaat/tokens/tokens.json', () => ({
  spacing: {
    shellHorizontal: '20px',
    headerTop: '24px',
    productCardPadding: '14px',
  },
  radius: {
    base: '6px',
    control: '12px',
    panel: '12px',
    large: '16px',
    card: '16px',
    productCard: '14px',
    heroCard: '16px',
  },
  font: {
    brandTitle: '22px 700',
    sectionTitle: '20px 700',
    heroTitle: '16px 700',
    productCardTitle: '15px 700',
    bodyMeta: '12px 500',
    ctaLabel: '14px 600',
    utilityLabel: '11px 700',
  },
  color: {
    canvas: '#F8FAF9',
    surface: '#FFFFFF',
    surfaceMuted: '#F2F4F3',
    dark: '#101814',
    textPrimary: '#0F172A',
    textStrong: '#191C1C',
    textSecondary: '#64748B',
    textBody: '#404941',
    borderSoft: '#E2E8F0',
    progressTrack: '#E8EFEA',
    successText: '#8DCA9C',
    alertLive: '#E11D48',
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
    mockApiFetch.mockImplementation((path: string) => {
      if (path === "/buyer/group-buys") return Promise.resolve(MOCK_GROUP_BUYS);
      if (path === "/buyer/group-buys/gb-1") return Promise.resolve(MOCK_GROUP_BUY_DETAIL);
      return Promise.reject(new Error("Not found"));
    });
    mockApiPost.mockResolvedValue({ success: true });
  });

  it('renders the list screen', async () => {
    mockUseLocalSearchParams.mockReturnValue({});
    let tree: renderer.ReactTestRenderer | null = null;
    await act(async () => {
      tree = renderer.create(<GroupBuyListScreen />);
      await Promise.resolve();
    });
    expect((tree as unknown as renderer.ReactTestRenderer).toJSON()).toBeDefined();
  });

  it('renders the detail screen for a known route param', async () => {
    mockUseLocalSearchParams.mockReturnValue({ groupBuyId: 'gb-1' });
    let tree: renderer.ReactTestRenderer | null = null;
    await act(async () => {
      tree = renderer.create(<GroupBuyDetailScreen />);
      await Promise.resolve();
    });
    expect((tree as unknown as renderer.ReactTestRenderer).toJSON()).toBeDefined();
  });

  it('shows not found when the route param does not match a group buy', async () => {
    mockUseLocalSearchParams.mockReturnValue({ groupBuyId: 'missing' });

    let tree: renderer.ReactTestRenderer;
    await act(async () => {
      tree = renderer.create(<GroupBuyDetailScreen />);
      await Promise.resolve();
    });

    const textValues = tree!.root.findAllByType(Text).map((node) => node.props.children).flat();
    expect(textValues).toEqual(expect.arrayContaining(['ডিল পাওয়া যায়নি', 'Not found']));
  });
});
