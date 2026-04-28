import type { Locale } from "@fosholhaat/types";

export type PayoutStatus = "settled" | "processing" | "pending" | "failed";

export type PayoutRow = {
  id: string;
  period: string;
  date: string;
  orderRef: string;
  method: string;
  amount: number;
  status: PayoutStatus;
  note: string;
};

export type PayoutCopy = {
  appName: string;
  workspace: string;
  nav: Record<"dashboard" | "supply" | "orders" | "payouts" | "dwr" | "account", string>;
  searchPlaceholder: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  pendingLabel: string;
  nextDisbursementLabel: string;
  breakdown: string;
  summary: Record<"pending" | "completed" | "total", string>;
  activityTitle: string;
  filter: string;
  table: Record<"transactionId" | "date" | "orderRef" | "method" | "amount" | "status", string>;
  detail: Record<"title" | "subtitle" | "orderRef" | "method" | "date" | "noteLabel" | "action" | "notFoundTitle" | "notFoundBody", string>;
  profile: Record<"title" | "blurb" | "businessLabel" | "payoutMethodLabel" | "action", string>;
  export: Record<"title" | "blurb" | "csv" | "pdf", string>;
  mobileNav: Record<"home" | "orders" | "payouts" | "stock" | "profile", string>;
  empty: Record<"title" | "body", string>;
  loadMore: string;
  viewHistory: string;
  status: Record<PayoutStatus, string>;
};

export const SELLER_PAYOUT_ROWS: PayoutRow[] = [
  {
    id: "TR-10492",
    period: "Oct 28",
    date: "Oct 28, 2023",
    orderRef: "#FH-8492",
    method: "Bank Transfer",
    amount: 12450,
    status: "settled",
    note: "Funds landed in the linked commercial account.",
  },
  {
    id: "TR-10488",
    period: "Oct 27",
    date: "Oct 27, 2023",
    orderRef: "#FH-8485",
    method: "bKash (MFS)",
    amount: 8920,
    status: "processing",
    note: "Queued for the next settlement window.",
  },
  {
    id: "TR-10482",
    period: "Oct 26",
    date: "Oct 26, 2023",
    orderRef: "#FH-8472",
    method: "Bank Transfer",
    amount: 23830,
    status: "settled",
    note: "Completed and reflected in the payout rail.",
  },
  {
    id: "TR-10475",
    period: "Oct 24",
    date: "Oct 24, 2023",
    orderRef: "#FH-8461",
    method: "Bank Transfer",
    amount: 15200,
    status: "settled",
    note: "Settled in the last payout batch.",
  },
];

export const SELLER_PAYOUT_COPY: Record<Locale, PayoutCopy> = {
  en: {
    appName: "FosholHaat",
    workspace: "Seller workspace · Finance",
    nav: {
      dashboard: "Dashboard",
      supply: "Supply",
      orders: "Orders",
      payouts: "Payouts",
      dwr: "DWR Records",
      account: "Account",
    },
    searchPlaceholder: "Search transactions...",
    heroKicker: "Next disbursement",
    heroTitle: "Payouts & settlements",
    heroSubtitle: "Keep pending, completed, and period-wise payouts clear at a glance.",
    pendingLabel: "Pending settlement",
    nextDisbursementLabel: "Nov 05, 2023",
    breakdown: "Breakdown",
    summary: { pending: "Pending", completed: "Completed", total: "Total" },
    activityTitle: "Recent activity",
    filter: "Filter",
    table: {
      transactionId: "Transaction ID",
      date: "Date",
      orderRef: "Order ref",
      method: "Method",
      amount: "Amount",
      status: "Status",
    },
    detail: {
      title: "Selected payout detail",
      subtitle: "Summary-first payout view with one selected period.",
      orderRef: "Order ref",
      method: "Method",
      date: "Date",
      noteLabel: "Note",
      action: "Review payout line",
      notFoundTitle: "Payout detail unavailable",
      notFoundBody: "Pick a payout row to load the period detail.",
    },
    profile: {
      title: "Settlement profile",
      blurb: "Commercial account details used for automated seller settlements.",
      businessLabel: "Business entity",
      payoutMethodLabel: "Payout method",
      action: "View payout settings",
    },
    export: {
      title: "Audit export",
      blurb: "Download final payout reports for tax and operations records.",
      csv: "CSV Statement (Oct 2023)",
      pdf: "PDF Tax Invoice (Q3)",
    },
    mobileNav: {
      home: "Home",
      orders: "Orders",
      payouts: "Payouts",
      stock: "Stock",
      profile: "Profile",
    },
    empty: {
      title: "No payout rows yet",
      body: "When payouts arrive, they will appear here with status and amount.",
    },
    loadMore: "Load more history",
    viewHistory: "Showing 1-4 of 48 transactions",
    status: {
      settled: "Settled",
      processing: "Processing",
      pending: "Pending",
      failed: "Failed",
    },
  },
  bn: {
    appName: "FosholHaat",
    workspace: "বিক্রেতা কর্মক্ষেত্র · অর্থ",
    nav: {
      dashboard: "ড্যাশবোর্ড",
      supply: "সরবরাহ",
      orders: "অর্ডার",
      payouts: "পেআউট",
      dwr: "DWR রেকর্ড",
      account: "অ্যাকাউন্ট",
    },
    searchPlaceholder: "লেনদেন খুঁজুন...",
    heroKicker: "পরবর্তী ডিসবার্সমেন্ট",
    heroTitle: "পেআউট ও নিষ্পত্তি",
    heroSubtitle: "বকেয়া, নিষ্পন্ন, আর পিরিয়ডভিত্তিক পেআউট এক নজরে দেখুন।",
    pendingLabel: "বকেয়া নিষ্পত্তি",
    nextDisbursementLabel: "৫ নভেম্বর, ২০২৩",
    breakdown: "বিস্তার",
    summary: { pending: "বকেয়া", completed: "নিষ্পন্ন", total: "মোট" },
    activityTitle: "সাম্প্রতিক লেনদেন",
    filter: "ফিল্টার",
    table: {
      transactionId: "লেনদেন আইডি",
      date: "তারিখ",
      orderRef: "অর্ডার রেফারেন্স",
      method: "পদ্ধতি",
      amount: "অঙ্ক",
      status: "স্ট্যাটাস",
    },
    detail: {
      title: "নির্বাচিত পেআউটের বিস্তারিত",
      subtitle: "একটি পিরিয়ড বেছে নিন, বিস্তারিত সাথে সাথে দেখুন।",
      orderRef: "অর্ডার রেফারেন্স",
      method: "পদ্ধতি",
      date: "তারিখ",
      noteLabel: "নোট",
      action: "লাইন আইটেম দেখুন",
      notFoundTitle: "পেআউটের বিস্তারিত পাওয়া যায়নি",
      notFoundBody: "বিস্তারিত দেখতে একটি পেআউট সারি নির্বাচন করুন।",
    },
    profile: {
      title: "সেটেলমেন্ট প্রোফাইল",
      blurb: "অটোমেটেড বিক্রেতা নিষ্পত্তির জন্য ব্যবহৃত কমার্শিয়াল অ্যাকাউন্ট।",
      businessLabel: "ব্যবসা সত্তা",
      payoutMethodLabel: "পেআউট পদ্ধতি",
      action: "পেআউট সেটিংস দেখুন",
    },
    export: {
      title: "অডিট এক্সপোর্ট",
      blurb: "কর ও অপারেশন রেকর্ডের জন্য চূড়ান্ত পেআউট রিপোর্ট নামান।",
      csv: "CSV স্টেটমেন্ট (অক্টোবর ২০২৩)",
      pdf: "PDF ট্যাক্স ইনভয়েস (Q3)",
    },
    mobileNav: {
      home: "হোম",
      orders: "অর্ডার",
      payouts: "পেআউট",
      stock: "স্টক",
      profile: "প্রোফাইল",
    },
    empty: {
      title: "এখনো কোনো পেআউট নেই",
      body: "পেআউট এলে এখানে অঙ্ক ও স্ট্যাটাসসহ দেখাবে।",
    },
    loadMore: "আরও ইতিহাস দেখুন",
    viewHistory: "১-৪ / ৪৮ টি লেনদেন দেখানো হচ্ছে",
    status: {
      settled: "নিষ্পন্ন",
      processing: "প্রক্রিয়াধীন",
      pending: "বকেয়া",
      failed: "ব্যর্থ",
    },
  },
};
