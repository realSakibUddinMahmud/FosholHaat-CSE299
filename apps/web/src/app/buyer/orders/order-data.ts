import type { BuyerOrderDetail, Locale } from "@fosholhaat/types";

export const getOrderCopy = (_locale: Locale) => ({
  title: "My Orders",
  subtitle: "View and track all your orders",
  ongoing: "Ongoing",
  completed: "Completed",
  all: "All",
  track: "Track Order",
  viewDetails: "View Details",
  orderId: "Order ID",
  total: "Total",
  date: "Date",
  status: "Status",
  processing: "Waiting for seller",
  inTransit: "In fulfillment",
  shipped: "Ready for hub",
  delivered: "Completed",
  items: "Items",
  deliveryAddress: "Delivery Address",
  paymentMethod: "Payment Method",
  pricing: "Pricing Breakdown",
  subtotal: "Subtotal",
  deliveryFee: "Delivery Fee",
  bulkSavings: "Bulk Savings",
  totalAmount: "Total Amount",
  tracking: "Order Tracking",
  estArrival: "Est. Arrival",
  quantity: "Quantity",
  verified: "Verified",
  needHelp: "Need help",
  currentlyActive: "Live now",
  orderConfirmed: "Order confirmed",
  packedAtHub: "Packed at hub",
  logisticsInfo: "Delivery info",
  truckId: "Truck ID",
  fleet: "Fleet",
  callDriver: "Driver",
  message: "Message",
  orderSnapshot: "Order snapshot",
  contact: "Contact",
  viewOrderDetails: "View order",
  notFoundTitle: "Order not found",
  notFoundBody: "This order is missing or the ID is wrong.",
  backToOrders: "Back to orders",
});

export const getOrderStatusLabel = (_locale: Locale, status: BuyerOrderDetail["status"]) => {
  if (status === "PENDING_GROUP_LOCK") return "Waiting for group target";
  if (status === "PENDING_SELLER_REVIEW") return "Waiting for seller";
  if (status === "PENDING_PAYMENT") return "Payment pending";
  if (status === "CONFIRMED") return "Seller accepted";
  if (status === "IN_FULFILLMENT") return "Seller accepted";
  if (status === "READY_FOR_DISPATCH") return "Ready for hub";
  if (status === "CANCELLED") return "Cancelled";
  return "Completed";
};
