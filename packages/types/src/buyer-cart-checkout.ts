import type { Locale } from "./auth";

export const BUYER_FULFILLMENT_CHOICES = [
  "hub-pickup",
  "direct-delivery",
] as const;
export type BuyerFulfillmentChoice = (typeof BUYER_FULFILLMENT_CHOICES)[number];

export const BUYER_PAYMENT_METHODS = [
  "cash-on-delivery",
  "mobile-banking",
  "bank-transfer",
] as const;
export type BuyerPaymentMethod = (typeof BUYER_PAYMENT_METHODS)[number];

export interface BuyerCartLine {
  lineId: string;
  productId: string;
  productName: string;
  sellerName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
  mode?: "SINGLE" | "GROUP";
  groupBuyId?: string;
  note?: string;
}

export interface BuyerCartTotals {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  payableTotal: number;
}

export interface BuyerCartResponse {
  lines: BuyerCartLine[];
  totals: BuyerCartTotals;
  nextRoute: "/buyer/checkout";
}

export interface BuyerCartMutationPayload {
  quantity?: number;
  mode?: "SINGLE" | "GROUP";
  groupBuyId?: string;
}

export interface BuyerFulfillmentDetails {
  choice: BuyerFulfillmentChoice;
  recipientName: string;
  phone: string;
  addressLabel?: string;
  note?: string;
}

export interface BuyerFulfillmentResponse {
  fulfillment: BuyerFulfillmentDetails;
  nextRoute: "/buyer/checkout/payment";
}

export interface BuyerPaymentDetails {
  method: BuyerPaymentMethod;
  payableTotal: number;
  referenceLabel?: string;
}

export interface BuyerPaymentResponse {
  payment: BuyerPaymentDetails;
  nextRoute: "/buyer/checkout/confirmation";
}

export interface BuyerCheckoutConfirmationSnapshot {
  lines: BuyerCartLine[];
  totals: BuyerCartTotals;
  fulfillment: BuyerFulfillmentDetails;
  payment: BuyerPaymentDetails;
}

export interface BuyerCheckoutSubmitResponse {
  orderId: string;
  successRoute: "/buyer/orders/success";
}

export interface BuyerCheckoutErrorResponse {
  error: {
    code:
      | "EMPTY_CART"
      | "INVALID_QUANTITY"
      | "MISSING_FULFILLMENT_DETAILS"
      | "PAYMENT_VALIDATION_FAILED"
      | "CHECKOUT_SUBMISSION_CONFLICT";
    message: string;
    lineId?: string;
  };
}

export type BuyerCartCheckoutCopy = {
  cartTitle: string;
  checkoutTitle: string;
  fulfillmentTitle: string;
  paymentTitle: string;
  confirmationTitle: string;
  successTitle: string;
  summaryTitle: string;
  emptyCartTitle: string;
  emptyCartBody: string;
  actions: {
    reviewCart: string;
    continueToCheckout: string;
    continueToPayment: string;
    continueToConfirmation: string;
    submitOrder: string;
    viewOrders: string;
  };
  labels: {
    quantity: string;
    subtotal: string;
    deliveryFee: string;
    serviceFee: string;
    payableTotal: string;
    fulfillment: string;
    paymentMethod: string;
    address: string;
    recipient: string;
  };
  fulfillmentChoices: Record<BuyerFulfillmentChoice, string>;
  paymentMethods: Record<BuyerPaymentMethod, string>;
  stepLabels: {
    cart: string;
    fulfillment: string;
    payment: string;
    confirmation: string;
  };
};

export const BUYER_CART_CHECKOUT_COPY: Record<Locale, BuyerCartCheckoutCopy> = {
  en: {
    cartTitle: "Your cart",
    checkoutTitle: "Checkout",
    fulfillmentTitle: "Fulfillment details",
    paymentTitle: "Payment details",
    confirmationTitle: "Confirm order",
    successTitle: "Order placed",
    summaryTitle: "Order summary",
    emptyCartTitle: "Your cart is empty",
    emptyCartBody: "Add products first, then return here to place the order.",
    actions: {
      reviewCart: "Review cart",
      continueToCheckout: "Continue to checkout",
      continueToPayment: "Continue to payment",
      continueToConfirmation: "Continue to confirmation",
      submitOrder: "Place order",
      viewOrders: "View orders",
    },
    labels: {
      quantity: "Quantity",
      subtotal: "Subtotal",
      deliveryFee: "Delivery fee",
      serviceFee: "Service fee",
      payableTotal: "Total payable",
      fulfillment: "Fulfillment",
      paymentMethod: "Payment method",
      address: "Address",
      recipient: "Recipient",
    },
    fulfillmentChoices: {
      "hub-pickup": "Hub pickup",
      "direct-delivery": "Direct delivery",
    },
    paymentMethods: {
      "cash-on-delivery": "Cash on delivery",
      "mobile-banking": "Mobile banking",
      "bank-transfer": "Bank transfer",
    },
    stepLabels: {
      cart: "Cart",
      fulfillment: "Fulfillment",
      payment: "Payment",
      confirmation: "Confirmation",
    },
  },
  bn: {
    cartTitle: "আপনার কার্ট",
    checkoutTitle: "চেকআউট",
    fulfillmentTitle: "ডেলিভারির তথ্য",
    paymentTitle: "পেমেন্টের তথ্য",
    confirmationTitle: "অর্ডার নিশ্চিত করুন",
    successTitle: "অর্ডার সম্পন্ন",
    summaryTitle: "অর্ডারের সারসংক্ষেপ",
    emptyCartTitle: "কার্টে কিছু নেই",
    emptyCartBody: "আগে পণ্য যোগ করুন, তারপর এখান থেকে অর্ডার দিন।",
    actions: {
      reviewCart: "কার্ট দেখুন",
      continueToCheckout: "চেকআউটে যান",
      continueToPayment: "পেমেন্টে যান",
      continueToConfirmation: "নিশ্চিতকরণে যান",
      submitOrder: "অর্ডার দিন",
      viewOrders: "অর্ডার দেখুন",
    },
    labels: {
      quantity: "পরিমাণ",
      subtotal: "উপমোট",
      deliveryFee: "ডেলিভারি খরচ",
      serviceFee: "সার্ভিস খরচ",
      payableTotal: "মোট পরিশোধ",
      fulfillment: "ডেলিভারি ধরন",
      paymentMethod: "পেমেন্ট পদ্ধতি",
      address: "ঠিকানা",
      recipient: "গ্রহণকারী",
    },
    fulfillmentChoices: {
      "hub-pickup": "হাব থেকে নিন",
      "direct-delivery": "সরাসরি ডেলিভারি",
    },
    paymentMethods: {
      "cash-on-delivery": "ডেলিভারির সময় নগদ",
      "mobile-banking": "মোবাইল ব্যাংকিং",
      "bank-transfer": "ব্যাংক ট্রান্সফার",
    },
    stepLabels: {
      cart: "কার্ট",
      fulfillment: "ডেলিভারি",
      payment: "পেমেন্ট",
      confirmation: "নিশ্চিতকরণ",
    },
  },
};

export function getBuyerCartCheckoutCopy(
  locale: Locale,
): BuyerCartCheckoutCopy {
  return BUYER_CART_CHECKOUT_COPY[locale] ?? BUYER_CART_CHECKOUT_COPY.bn;
}
