import type { SellerOrderDetailResponse, SellerOrderQueueResponse, SellerOrderStatus } from "@fosholhaat/types";

export const SELLER_ORDER_TEST_QUEUE: SellerOrderQueueResponse = {
  summary: { incoming: 1, active: 0, ready: 0, groupProgress: 0 },
  groupProgress: [],
  orders: [{
    id: "SO-2001",
    buyerName: "Amina Traders",
    quantityLabel: "100 kg",
    dueLabel: "Bogura Hub",
    status: "incoming",
    nextAction: "accept",
    orderType: "SINGLE",
    paymentStatus: "PAID",
    totalLabel: "BDT 12,500",
    productName: "Potato",
    hubName: "Bogura Hub",
  }],
};

export const SELLER_ORDER_TEST_DETAIL: SellerOrderDetailResponse = {
  order: {
    ...SELLER_ORDER_TEST_QUEUE.orders[0],
    unitPriceLabel: "BDT 125",
    pickupWindow: "Bogura Hub",
    notes: ["Buyer confirmed payment method."],
    items: [{ name: "Potato", quantityLabel: "100 kg", packageLabel: "Bag" }],
    trackingEvents: [],
  },
};

/**
 * Pure display helper – maps order status to a localized action label.
 * No static data here; this is UI-only logic.
 */
export function nextActionLabel(
  status: SellerOrderStatus,
  labels: {
    accept: string;
    pack: string;
    readyAction: string;
    reject: string;
  },
) {
  switch (status) {
    case "incoming":
      return labels.accept;
    case "accepted":
      return "Print QR label";
    case "packed":
    case "handoff_ready":
      return "Ready for hub";
    case "hub_received":
      return "Hub received";
    case "sorting":
      return "Sorting";
    case "ready":
      return labels.readyAction;
    case "rejected":
      return labels.reject;
    default:
      return labels.accept;
  }
}
