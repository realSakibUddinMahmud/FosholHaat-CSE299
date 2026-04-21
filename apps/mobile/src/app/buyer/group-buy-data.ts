import { GroupBuyDetail, GroupBuySummary, Locale } from '@fosholhaat/types';

export const MOCK_GROUP_BUYS: GroupBuySummary[] = [
  {
    id: 'gb-1',
    productId: 'p-1',
    productName: { bn: 'বগুড়ার আলু', en: 'Bogura potatoes' },
    productImage: 'https://images.unsplash.com/photo-1518977676601-b53f02bad177',
    unitPrice: 45,
    groupPrice: 38,
    targetQuantity: 1000,
    currentQuantity: 650,
    deadline: '2026-04-23T18:00:00.000Z',
    status: 'ACTIVE',
    participantCount: 45,
    unit: { bn: 'কেজি', en: 'kg' },
  },
  {
    id: 'gb-2',
    productId: 'p-2',
    productName: { bn: 'লাল পেঁয়াজ', en: 'Red onion' },
    productImage: 'https://images.unsplash.com/photo-1508747703725-719777637510',
    unitPrice: 85,
    groupPrice: 72,
    targetQuantity: 500,
    currentQuantity: 420,
    deadline: '2026-04-22T18:00:00.000Z',
    status: 'ACTIVE',
    participantCount: 32,
    unit: { bn: 'কেজি', en: 'kg' },
  },
];

export const MOCK_GROUP_BUY_DETAIL: GroupBuyDetail = {
  ...MOCK_GROUP_BUYS[0],
  description: {
    bn: 'বগুড়া থেকে সরাসরি আনা আলু। একসাথে কিনলে দাম কমে যায়।',
    en: 'Potatoes sourced directly from Bogura. Buying together lowers the price.',
  },
  sellerId: 's-1',
  sellerName: 'Bogura Agro Traders',
  sellerRating: 4.8,
  minimumJoinQuantity: 10,
  maximumJoinQuantity: 100,
  timeLeft: '2 days',
};

export const MOCK_GROUP_BUY_DETAIL_RED_ONION: GroupBuyDetail = {
  ...MOCK_GROUP_BUYS[1],
  description: {
    bn: 'লাল পেঁয়াজের এই লটে দ্রুত সরবরাহ পাওয়া যায়। একসাথে কিনলে খরচ কমে।',
    en: 'This red onion lot is available for fast supply. Group buying cuts the cost.',
  },
  sellerId: 's-2',
  sellerName: 'Kahaloo Produce Desk',
  sellerRating: 4.6,
  minimumJoinQuantity: 8,
  maximumJoinQuantity: 80,
  timeLeft: '1 day',
};

const GROUP_BUY_DETAILS: Record<string, GroupBuyDetail> = {
  [MOCK_GROUP_BUY_DETAIL.id]: MOCK_GROUP_BUY_DETAIL,
  [MOCK_GROUP_BUY_DETAIL_RED_ONION.id]: MOCK_GROUP_BUY_DETAIL_RED_ONION,
};

export function getGroupBuyById(groupBuyId: string) {
  return GROUP_BUY_DETAILS[groupBuyId] ?? null;
}

export type GroupBuyCopy = {
  listTitle: string;
  listSubtitle: string;
  emptyTitle: string;
  emptyMessage: string;
  detailTitle: string;
  notFoundTitle: string;
  notFoundMessage: string;
  backToList: string;
  activeStatus: string;
  timeLeft: string;
  groupPriceLabel: string;
  regularPriceLabel: string;
  progressTitle: string;
  targetLabel: string;
  currentLabel: string;
  descriptionTitle: string;
  minQuantityNote: string;
  targetNote: string;
  joinButton: string;
  joiningStatus: string;
  joinSuccess: string;
  unitPriceLabel: string;
  savingsLabel: string;
  perUnit: string;
  joinedCount: string;
  joinPending: string;
  joinError: string;
};

const GROUP_BUY_COPY: Record<Locale, GroupBuyCopy> = {
  en: {
    listTitle: "Group Buy Deals",
    listSubtitle: "Join active deals and pay less together",
    emptyTitle: "No group buys yet",
    emptyMessage: "New deals will appear here when they are ready.",
    detailTitle: "Deal Details",
    notFoundTitle: "Deal not found",
    notFoundMessage: "This group buy is not available anymore.",
    backToList: "Back to list",
    activeStatus: "Active Deal",
    timeLeft: "days left",
    groupPriceLabel: "Group Price",
    regularPriceLabel: "Regular Price",
    progressTitle: "Deal Progress",
    targetLabel: "Target",
    currentLabel: "Filled",
    descriptionTitle: "Product Description",
    minQuantityNote: "Minimum order",
    targetNote: "Delivery starts after target is met",
    joinButton: "Join Group",
    joiningStatus: "Joining...",
    joinSuccess: "Successfully joined the group buy!",
    unitPriceLabel: "Unit Price",
    savingsLabel: "Total Savings",
    perUnit: "per",
    joinedCount: "joined",
    joinPending: "Joining...",
    joinError: "Could not join right now.",
  },
  bn: {
    listTitle: "গ্রুপ বাই ডিল",
    listSubtitle: "চলতি ডিল দেখুন, একসাথে কিনে দাম কমান",
    emptyTitle: "এখনো কোনো গ্রুপ বাই নেই",
    emptyMessage: "নতুন ডিল এলে এখানে দেখাবে।",
    detailTitle: "ডিল ডিটেইলস",
    notFoundTitle: "ডিল পাওয়া যায়নি",
    notFoundMessage: "এই গ্রুপ বাই এখন আর নেই।",
    backToList: "তালিকায় ফিরুন",
    activeStatus: "সচল ডিল",
    timeLeft: "দিন বাকি",
    groupPriceLabel: "গ্রুপ দাম",
    regularPriceLabel: "স্বাভাবিক দাম",
    progressTitle: "ডিল প্রগ্রেস",
    targetLabel: "লক্ষ্য",
    currentLabel: "পূরণ হয়েছে",
    descriptionTitle: "পণ্যের বিবরণ",
    minQuantityNote: "সর্বনিম্ন অর্ডার",
    targetNote: "লক্ষ্য পূরণ হলে ডেলিভারি শুরু হবে",
    joinButton: "গ্রুপে যোগ দিন",
    joiningStatus: "যোগ দিচ্ছেন...",
    joinSuccess: "গ্রুপ বাই-এ যোগ দেওয়া সফল হয়েছে!",
    unitPriceLabel: "একক দাম",
    savingsLabel: "মোট সাশ্রয়",
    perUnit: "প্রতি",
    joinedCount: "জন যোগ দিয়েছেন",
    joinPending: "যোগ দিচ্ছি...",
    joinError: "এখন যোগ দেওয়া গেল না।",
  },
};

export function getGroupBuyCopy(locale: Locale) {
  return GROUP_BUY_COPY[locale] ?? GROUP_BUY_COPY.bn;
}
