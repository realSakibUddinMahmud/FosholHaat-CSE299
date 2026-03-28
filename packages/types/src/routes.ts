import type { FeatureApprovalStatus } from "./enums";

export const SHELL_ROUTES = {
  shared: "/",
  buyer: "/buyer",
  seller: "/seller",
  hub: "/hub",
} as const;

export type ShellRouteKey = keyof typeof SHELL_ROUTES;
export type ShellRoutePath = (typeof SHELL_ROUTES)[ShellRouteKey];

export const FEATURE_ROUTES = {
  buyerAuth: ["/signup/buyer"],
  buyerCartAndCheckout: [
    "/buyer/cart",
    "/buyer/checkout",
    "/buyer/checkout/confirmation",
    "/buyer/checkout/fulfillment",
    "/buyer/checkout/payment",
    "/buyer/orders/success",
  ],
  buyerDiscovery: [
    "/buyer",
    "/buyer/categories/[categorySlug]",
    "/buyer/products/[productId]",
    "/buyer/search",
  ],
  buyerGroupBuy: ["/buyer/group-buys", "/buyer/group-buys/[groupBuyId]"],
  buyerOrdersAndTracking: [
    "/buyer/orders",
    "/buyer/orders/[orderId]",
    "/buyer/orders/[orderId]/tracking",
  ],
  hubCoordination: ["/hub", "/hub/coordination"],
  hubDispatchOperations: ["/hub/dispatch", "/hub/dispatch/[loadId]"],
  hubExceptionManagement: ["/hub/exceptions"],
  hubInboundOperations: ["/hub/inbound", "/hub/inbound/[receiptId]"],
  hubSortingOperations: ["/hub/sorting", "/hub/sorting/[batchId]"],
  sellerAuth: ["/signup/seller"],
  sellerOrdersAndFulfillment: ["/seller/orders", "/seller/orders/[orderId]"],
  sellerPayoutVisibility: ["/seller/payouts"],
  sellerSupplyOperations: [
    "/seller",
    "/seller/dwr/[recordId]",
    "/seller/supply",
    "/seller/supply/new",
  ],
  sharedAuth: ["/welcome", "/language", "/login", "/signup/role"],
} as const;

export type FeatureRouteKey = keyof typeof FEATURE_ROUTES;
export type FeatureRoutePath =
  (typeof FEATURE_ROUTES)[FeatureRouteKey][number];

export const FEATURE_ROUTE_APPROVAL: Record<
  FeatureRouteKey,
  FeatureApprovalStatus
> = {
  buyerAuth: "mobile-only approved",
  buyerCartAndCheckout: "mobile+web approved",
  buyerDiscovery: "mobile+web approved",
  buyerGroupBuy: "mobile-only approved",
  buyerOrdersAndTracking: "mobile+web approved",
  hubCoordination: "mobile+web approved",
  hubDispatchOperations: "mobile-only approved",
  hubExceptionManagement: "mobile-only approved",
  hubInboundOperations: "mobile+web approved",
  hubSortingOperations: "mobile+web approved",
  sellerAuth: "mobile-only approved",
  sellerOrdersAndFulfillment: "mobile+web approved",
  sellerPayoutVisibility: "mobile+web approved",
  sellerSupplyOperations: "mobile+web approved",
  sharedAuth: "mobile+web partially approved",
};
