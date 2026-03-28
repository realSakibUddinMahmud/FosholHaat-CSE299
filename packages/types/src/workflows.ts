export const ORDER_STATES = [
  "draft",
  "pending_confirmation",
  "confirmed",
  "processing",
  "ready_for_dispatch",
  "in_transit",
  "delivered",
  "cancelled",
] as const;
export type OrderState = (typeof ORDER_STATES)[number];

export const PAYMENT_STATES = [
  "unpaid",
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

export const FULFILLMENT_STATES = [
  "pending",
  "pickup_selected",
  "delivery_selected",
  "packed",
  "handoff_ready",
  "completed",
] as const;
export type FulfillmentState = (typeof FULFILLMENT_STATES)[number];

export const SUPPLY_STATES = [
  "draft",
  "submitted",
  "verified",
  "published",
  "committed",
  "archived",
] as const;
export type SupplyState = (typeof SUPPLY_STATES)[number];

export const HUB_OPERATION_STATES = [
  "inbound_pending",
  "received",
  "sorting",
  "ready_for_dispatch",
  "dispatched",
  "exception",
] as const;
export type HubOperationState = (typeof HUB_OPERATION_STATES)[number];

export const GROUP_BUY_STATES = [
  "open",
  "threshold_met",
  "locked",
  "fulfilled",
  "cancelled",
] as const;
export type GroupBuyState = (typeof GROUP_BUY_STATES)[number];
