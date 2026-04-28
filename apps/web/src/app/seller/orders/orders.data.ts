import type {
  Locale,
  SellerOrderDetail,
  SellerOrderDetailResponse,
  SellerOrderQueueResponse,
  SellerOrderStatus,
  SellerOrderSummary,
} from "@fosholhaat/types";
import { getSellerOrdersCopy } from "@fosholhaat/types";

const SELLER_ORDER_SUMMARIES: SellerOrderSummary[] = [
  {
    id: "so-20260421-001",
    buyerName: "Green Mart Dhaka",
    quantityLabel: "48 bags potato",
    dueLabel: "Today, 4:30 PM",
    status: "incoming",
    nextAction: "accept",
  },
  {
    id: "so-20260421-002",
    buyerName: "Karwan Bazaar Retail",
    quantityLabel: "22 crates onion",
    dueLabel: "Today, 6:00 PM",
    status: "accepted",
    nextAction: "pack",
  },
  {
    id: "so-20260420-003",
    buyerName: "Mirpur Fresh Corner",
    quantityLabel: "65 kg vegetables",
    dueLabel: "Tomorrow, 8:00 AM",
    status: "packed",
    nextAction: "ready",
  },
  {
    id: "so-20260420-004",
    buyerName: "Tejgaon Supply Point",
    quantityLabel: "18 bags potato",
    dueLabel: "Tomorrow, 10:30 AM",
    status: "ready",
    nextAction: "none",
  },
];

const SELLER_ORDER_DETAILS: Record<string, SellerOrderDetail> = {
  "so-20260421-001": {
    ...SELLER_ORDER_SUMMARIES[0],
    items: [
      { name: "Potato", quantityLabel: "30 bags", packageLabel: "Jute bag lot" },
      { name: "Potato", quantityLabel: "18 bags", packageLabel: "Reserve lot" },
    ],
    pickupWindow: "Today, 5:00 PM to 6:00 PM",
    notes: [
      "Buyer wants a call before dispatch.",
      "Keep the invoice with the pickup bundle.",
    ],
  },
  "so-20260421-002": {
    ...SELLER_ORDER_SUMMARIES[1],
    items: [
      { name: "Onion", quantityLabel: "14 crates", packageLabel: "Plastic crate lot" },
      { name: "Onion", quantityLabel: "8 crates", packageLabel: "Loose top-up" },
    ],
    pickupWindow: "Today, 6:30 PM to 7:30 PM",
    notes: [
      "Pack with dry lining to protect the crop.",
      "Hub desk already confirmed vehicle arrival.",
    ],
  },
  "so-20260420-003": {
    ...SELLER_ORDER_SUMMARIES[2],
    items: [
      { name: "Mixed vegetables", quantityLabel: "40 kg", packageLabel: "Crate mix" },
      { name: "Leaf vegetables", quantityLabel: "25 kg", packageLabel: "Fresh crate" },
    ],
    pickupWindow: "Tomorrow, 8:00 AM to 9:00 AM",
    notes: [
      "This order is packed and waiting for ready check.",
      "Confirm quality seal before handoff.",
    ],
  },
  "so-20260420-004": {
    ...SELLER_ORDER_SUMMARIES[3],
    items: [
      { name: "Potato", quantityLabel: "10 bags", packageLabel: "Jute bag lot" },
      { name: "Potato", quantityLabel: "8 bags", packageLabel: "Reserve lot" },
    ],
    pickupWindow: "Tomorrow, 10:30 AM to 11:00 AM",
    notes: [
      "Ready for hub pickup after final count.",
      "Buyer asked to keep this lot on the front rack.",
    ],
  },
};

export const SELLER_ORDER_QUEUE: SellerOrderQueueResponse = {
  summary: {
    incoming: 1,
    active: 2,
    ready: 1,
  },
  orders: SELLER_ORDER_SUMMARIES,
};

export function getSellerOrdersCopyWeb(locale: Locale) {
  return getSellerOrdersCopy(locale);
}

export function getSellerOrderStatusLabel(
  locale: Locale,
  status: SellerOrderStatus,
) {
  return getSellerOrdersCopy(locale).statuses[status];
}

export function getSellerOrderDetail(
  orderId: string,
): SellerOrderDetailResponse | null {
  const order = SELLER_ORDER_DETAILS[orderId];
  return order ? { order } : null;
}
