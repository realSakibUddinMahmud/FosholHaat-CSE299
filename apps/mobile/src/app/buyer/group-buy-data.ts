import { Locale } from '@fosholhaat/types';

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
