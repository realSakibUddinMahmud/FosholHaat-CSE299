import type { Locale } from "./auth";

export const SELLER_ORDER_STATUSES = [
  "incoming",
  "accepted",
  "packed",
  "handoff_ready",
  "hub_received",
  "sorting",
  "ready",
  "rejected",
] as const;
export type SellerOrderStatus = (typeof SELLER_ORDER_STATUSES)[number];

export type SellerOrderNextAction =
  | "accept"
  | "print_label"
  | "ready_for_hub"
  | "reject"
  | "none";

export type SellerHandoffStatus =
  | "CREATED"
  | "LABEL_PRINTED"
  | "READY_FOR_HUB"
  | "RECEIVED"
  | "DISCREPANCY";

export interface SellerHandoffInfo {
  handoffCode: string;
  qrPayload: string;
  sealCode: string;
  status: SellerHandoffStatus;
  hubName: string;
  hubDistrict: string;
  labelPrintedAt?: string;
  sellerReadyAt?: string;
  hubReceivedAt?: string;
  discrepancyNotes?: string;
}

export interface SellerOrderEvent {
  id: string;
  eventType: string;
  label: string;
  message: string;
  actorRole: "BUYER" | "SELLER" | "HUB_MANAGER";
  createdAt: string;
  status: "done" | "current" | "upcoming";
}

export interface SellerOrderSummary {
  id: string;
  buyerName: string;
  quantityLabel: string;
  dueLabel: string;
  status: SellerOrderStatus;
  nextAction: SellerOrderNextAction;
  orderType: "SINGLE" | "GROUP";
  paymentStatus: "PENDING" | "AUTHORIZED" | "PAID" | "FAILED" | "REFUNDED";
  totalLabel: string;
  productName?: string;
  productImageUrl?: string;
  hubName?: string;
}

export interface SellerOrderItem {
  name: string;
  quantityLabel: string;
  packageLabel: string;
}

export interface SellerOrderDetail extends SellerOrderSummary {
  items: SellerOrderItem[];
  pickupWindow: string;
  notes: string[];
  unitPriceLabel: string;
  handoff?: SellerHandoffInfo;
  trackingEvents: SellerOrderEvent[];
}

export interface SellerGroupProgress {
  id: string;
  supplyLotId: string;
  title: string;
  committedQty: number;
  targetQty: number;
  percent: number;
  unit: string;
  deadlineLabel: string;
  buyerCount: number;
}

export interface SellerOrderQueueResponse {
  summary: {
    incoming: number;
    active: number;
    ready: number;
    groupProgress: number;
  };
  orders: SellerOrderSummary[];
  groupProgress: SellerGroupProgress[];
}

export interface SellerOrderDetailResponse {
  order: SellerOrderDetail;
}

export interface SellerOrderMutationResponse {
  order: SellerOrderDetail;
  message: string;
}

export interface SellerOrderErrorResponse {
  message: string;
  orderId?: string;
}

export type SellerOrdersCopy = {
  queueTitle: string;
  queueSubtitle: string;
  detailTitle: string;
  detailSubtitle: string;
  emptyTitle: string;
  emptyBody: string;
  notFoundTitle: string;
  notFoundBody: string;
  incoming: string;
  active: string;
  ready: string;
  buyer: string;
  quantity: string;
  due: string;
  status: string;
  pickupWindow: string;
  accept: string;
  pack: string;
  readyAction: string;
  reject: string;
  viewDetail: string;
  mutationSuccess: string;
  statuses: Record<SellerOrderStatus, string>;
};

export const SELLER_ORDERS_COPY: Record<Locale, SellerOrdersCopy> = {
  en: {
    queueTitle: "Seller orders",
    queueSubtitle:
      "Check incoming orders, move each one forward, and keep the next action visible.",
    detailTitle: "Order detail",
    detailSubtitle: "See items, pickup window, and the next fulfillment step.",
    emptyTitle: "No seller orders right now",
    emptyBody: "New buyer orders will appear here when they reach your queue.",
    notFoundTitle: "Order not found",
    notFoundBody: "This seller order is missing or the link is wrong.",
    incoming: "Incoming",
    active: "In progress",
    ready: "Ready",
    buyer: "Buyer",
    quantity: "Quantity",
    due: "Due",
    status: "Status",
    pickupWindow: "Pickup window",
    accept: "Accept",
    pack: "Mark packed",
    readyAction: "Mark ready",
    reject: "Reject",
    viewDetail: "View order",
    mutationSuccess: "Order status updated.",
    statuses: {
      incoming: "Incoming",
      accepted: "Accepted",
      packed: "Packed",
      handoff_ready: "Ready for hub",
      hub_received: "Hub received",
      sorting: "Sorting",
      ready: "Ready",
      rejected: "Rejected",
    },
  },
  bn: {
    queueTitle: "বিক্রেতার অর্ডার",
    queueSubtitle:
      "নতুন অর্ডার দেখুন, ধাপে ধাপে এগিয়ে নিন, আর পরের কাজ চোখের সামনে রাখুন।",
    detailTitle: "অর্ডার বিস্তারিত",
    detailSubtitle: "পণ্য, pickup window আর পরের fulfillment ধাপ দেখুন।",
    emptyTitle: "এখন কোনো অর্ডার নেই",
    emptyBody: "নতুন buyer order এলে এখানে দেখা যাবে।",
    notFoundTitle: "অর্ডার পাওয়া যায়নি",
    notFoundBody: "এই seller order টি নেই বা লিংকটি ভুল।",
    incoming: "নতুন",
    active: "চলমান",
    ready: "প্রস্তুত",
    buyer: "ক্রেতা",
    quantity: "পরিমাণ",
    due: "সময়",
    status: "অবস্থা",
    pickupWindow: "পিকআপ সময়",
    accept: "গ্রহণ করুন",
    pack: "প্যাক হয়েছে",
    readyAction: "প্রস্তুত করুন",
    reject: "বাতিল করুন",
    viewDetail: "অর্ডার দেখুন",
    mutationSuccess: "অর্ডারের অবস্থা বদলেছে।",
    statuses: {
      incoming: "নতুন",
      accepted: "গ্রহণ করা",
      packed: "প্যাক হয়েছে",
      handoff_ready: "হাবে পাঠানোর জন্য প্রস্তুত",
      hub_received: "হাব গ্রহণ করেছে",
      sorting: "সর্টিং চলছে",
      ready: "প্রস্তুত",
      rejected: "বাতিল",
    },
  },
};

export function getSellerOrdersCopy(locale: Locale): SellerOrdersCopy {
  return SELLER_ORDERS_COPY[locale] ?? SELLER_ORDERS_COPY.bn;
}
