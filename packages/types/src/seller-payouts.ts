import type { Locale } from "./auth";

export const SELLER_PAYOUT_STATUSES = ["pending", "processing", "settled"] as const;
export type SellerPayoutStatus = (typeof SELLER_PAYOUT_STATUSES)[number];

export interface SellerPayoutAmountSummary {
  pending: number;
  completed: number;
  total: number;
  nextDisbursementAmount: number;
  nextDisbursementDate: string;
}

export interface SellerPayoutRecord {
  id: string;
  referenceCode: string;
  orderRef: string;
  method: string;
  status: SellerPayoutStatus;
  amount: number;
  createdAt: string;
  periodLabel: string;
}

export interface SellerPayoutDetail extends SellerPayoutRecord {
  businessName: string;
  payoutAccountLabel: string;
  breakdown: Array<{
    label: string;
    amount: number;
  }>;
  documents: Array<{
    id: string;
    title: string;
    format: "csv" | "pdf";
  }>;
}

export interface SellerPayoutListResponse {
  summary: SellerPayoutAmountSummary;
  records: SellerPayoutRecord[];
  featuredDetailId: string;
}

export interface SellerPayoutDetailResponse {
  payout: SellerPayoutDetail;
}

export interface SellerPayoutErrorResponse {
  message: string;
  payoutId?: string;
}

export type SellerPayoutCopy = {
  title: string;
  subtitle: string;
  summaryLabel: string;
  nextDisbursement: string;
  pendingSettlement: string;
  totalPaid: string;
  recentActivity: string;
  filter: string;
  breakdown: string;
  settlementProfile: string;
  settlementProfileHint: string;
  payoutMethod: string;
  viewPayoutSettings: string;
  auditExport: string;
  auditExportHint: string;
  loadMoreHistory: string;
  previous: string;
  next: string;
  transactionId: string;
  orderRef: string;
  method: string;
  amount: string;
  status: string;
  emptyTitle: string;
  emptyBody: string;
  notFoundTitle: string;
  notFoundBody: string;
  statuses: Record<SellerPayoutStatus, string>;
};

export const SELLER_PAYOUT_COPY: Record<Locale, SellerPayoutCopy> = {
  en: {
    title: "Settlements and payouts",
    subtitle:
      "See what is due, what is paid, and which payout needs attention.",
    summaryLabel: "Payout summary",
    nextDisbursement: "Next payout",
    pendingSettlement: "Pending",
    totalPaid: "Paid",
    recentActivity: "Recent payouts",
    filter: "Filter",
    breakdown: "Breakdown",
    settlementProfile: "Payout profile",
    settlementProfileHint:
      "The account used for seller payouts and settlement files.",
    payoutMethod: "Payout method",
    viewPayoutSettings: "View payout settings",
    auditExport: "Export files",
    auditExportHint: "Download files for tax and payout checks.",
    loadMoreHistory: "Load more history",
    previous: "Previous",
    next: "Next",
    transactionId: "Transaction",
    orderRef: "Order ref",
    method: "Method",
    amount: "Amount",
    status: "Status",
    emptyTitle: "No payout history yet",
    emptyBody: "Your payout updates will show here after orders are settled.",
    notFoundTitle: "Payout not found",
    notFoundBody: "This payout record could not be found. Check the link and try again.",
    statuses: {
      pending: "Pending",
      processing: "Processing",
      settled: "Settled",
    },
  },
  bn: {
    title: "পাওনা ও পেমেন্ট",
    subtitle:
      "কত টাকা আসবে, কত টাকা পেয়েছেন, আর কোন পেমেন্টে নজর দরকার তা দেখুন।",
    summaryLabel: "পেমেন্ট সারসংক্ষেপ",
    nextDisbursement: "পরের পেমেন্ট",
    pendingSettlement: "বাকি আছে",
    totalPaid: "পেয়েছেন",
    recentActivity: "সাম্প্রতিক পেমেন্ট",
    filter: "ফিল্টার",
    breakdown: "বিস্তারিত",
    settlementProfile: "পেমেন্ট তথ্য",
    settlementProfileHint:
      "এই হিসাবে আপনার বিক্রির টাকা আর হিসাবের ফাইল যাবে।",
    payoutMethod: "টাকা নেওয়ার উপায়",
    viewPayoutSettings: "পেমেন্ট সেটিংস দেখুন",
    auditExport: "ফাইল নামান",
    auditExportHint: "কর আর পেমেন্ট মিলিয়ে দেখার ফাইল নামান।",
    loadMoreHistory: "আরও দেখুন",
    previous: "পেছনে",
    next: "পরেরটা",
    transactionId: "ট্রানজ্যাকশন",
    orderRef: "অর্ডার রেফারেন্স",
    method: "উপায়",
    amount: "টাকা",
    status: "অবস্থা",
    emptyTitle: "এখনও কোনো পেমেন্ট নেই",
    emptyBody: "অর্ডার সেটেল হলে এখানেই পেমেন্টের খবর দেখবেন।",
    notFoundTitle: "পেমেন্ট খুঁজে পাওয়া যায়নি",
    notFoundBody: "এই পেমেন্টটি পাওয়া যায়নি। লিংক দেখে আবার চেষ্টা করুন।",
    statuses: {
      pending: "বাকি",
      processing: "চলছে",
      settled: "পাওয়া গেছে",
    },
  },
};

export function getSellerPayoutCopy(locale: Locale): SellerPayoutCopy {
  return SELLER_PAYOUT_COPY[locale] ?? SELLER_PAYOUT_COPY.bn;
}
