import type {
  SellerOrderDetail,
  SellerOrderDetailResponse,
  SellerOrderQueueResponse,
  SellerOrderStatus,
  SellerOrderSummary,
} from "@fosholhaat/types";

const SELLER_ORDERS: SellerOrderDetail[] = [
  {
    id: "SO-2001",
    buyerName: "Amina Traders",
    quantityLabel: "18 bags",
    dueLabel: "Today, 4:30 PM",
    status: "incoming",
    nextAction: "accept",
    items: [
      { name: "Potato", quantityLabel: "12 bags", packageLabel: "50 kg bag" },
      { name: "Onion", quantityLabel: "6 bags", packageLabel: "40 kg bag" },
    ],
    pickupWindow: "Today, 5:00 PM - 6:00 PM",
    notes: ["Buyer confirmed payment method.", "Send a quick accept update."],
  },
  {
    id: "SO-2002",
    buyerName: "Rupshi Wholesale",
    quantityLabel: "10 crates",
    dueLabel: "Today, 6:00 PM",
    status: "packed",
    nextAction: "ready",
    items: [
      { name: "Vegetables", quantityLabel: "10 crates", packageLabel: "Mixed crate" },
    ],
    pickupWindow: "Today, 6:30 PM - 7:00 PM",
    notes: ["Packed and tagged.", "Move to ready bay."],
  },
  {
    id: "SO-2003",
    buyerName: "Dhaka Mart",
    quantityLabel: "24 bags",
    dueLabel: "Tomorrow, 10:00 AM",
    status: "accepted",
    nextAction: "pack",
    items: [
      { name: "Potato", quantityLabel: "16 bags", packageLabel: "50 kg bag" },
      { name: "Onion", quantityLabel: "8 bags", packageLabel: "40 kg bag" },
    ],
    pickupWindow: "Tomorrow, 9:30 AM - 10:30 AM",
    notes: ["Allocate stock before morning loading."],
  },
];

export const SELLER_ORDERS_QUEUE: SellerOrderQueueResponse = {
  summary: {
    incoming: SELLER_ORDERS.filter((order) => order.status === "incoming").length,
    active: SELLER_ORDERS.filter(
      (order) => order.status === "accepted" || order.status === "packed",
    ).length,
    ready: SELLER_ORDERS.filter((order) => order.status === "ready").length,
  },
  orders: SELLER_ORDERS.map(mapSummary),
};

export function getSellerOrderById(orderId?: string): SellerOrderDetailResponse["order"] | null {
  if (!orderId) return null;
  return SELLER_ORDERS.find((order) => order.id === orderId) ?? null;
}

export function getSellerOrders(): SellerOrderSummary[] {
  return SELLER_ORDERS.map(mapSummary);
}

function mapSummary(order: SellerOrderDetail): SellerOrderSummary {
  return {
    id: order.id,
    buyerName: order.buyerName,
    quantityLabel: order.quantityLabel,
    dueLabel: order.dueLabel,
    status: order.status,
    nextAction: order.nextAction,
  };
}

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
      return labels.pack;
    case "packed":
      return labels.readyAction;
    case "ready":
      return labels.readyAction;
    case "rejected":
      return labels.reject;
    default:
      return labels.accept;
  }
}
