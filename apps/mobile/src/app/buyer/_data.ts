import type {
  BuyerCartLine,
  BuyerCartResponse,
  BuyerCheckoutConfirmationSnapshot,
  BuyerCheckoutSubmitResponse,
  BuyerFulfillmentDetails,
  BuyerPaymentDetails,
  Locale,
} from "@fosholhaat/types";
import { getBuyerCartCheckoutCopy } from "@fosholhaat/types";

export type BuyerStepKey = "cart" | "fulfillment" | "payment" | "confirmation";

export const BUYER_STEP_ORDER: BuyerStepKey[] = [
  "cart",
  "fulfillment",
  "payment",
  "confirmation",
];

export const BUYER_CART_FIXTURE: BuyerCartResponse = {
  lines: [
    {
      lineId: "CL-1001",
      productId: "PR-2201",
      productName: "Bogura onion lot",
      sellerName: "Shibganj trade desk",
      quantity: 12,
      unit: "bags",
      unitPrice: 1200,
      subtotal: 14400,
      note: "Fresh arrival from the morning lane.",
    },
    {
      lineId: "CL-1002",
      productId: "PR-2202",
      productName: "Dhaka potato lot",
      sellerName: "Aditmari wholesale line",
      quantity: 20,
      unit: "crates",
      unitPrice: 1650,
      subtotal: 33000,
      note: "Sorted for mixed-size buyers.",
    },
    {
      lineId: "CL-1003",
      productId: "PR-2203",
      productName: "Season vegetables mix",
      sellerName: "Kahaloo produce cluster",
      quantity: 8,
      unit: "baskets",
      unitPrice: 900,
      subtotal: 7200,
      note: "Ready for same-day handoff.",
    },
  ],
  totals: {
    subtotal: 54600,
    deliveryFee: 1200,
    serviceFee: 900,
    payableTotal: 56700,
  },
  nextRoute: "/buyer/checkout",
};

export const BUYER_FULFILLMENT_FIXTURE: BuyerFulfillmentDetails = {
  choice: "hub-pickup",
  recipientName: "Abdul Karim",
  phone: "+8801712345678",
  addressLabel: "Bogura Sadar hub gate",
  note: "Call before handoff.",
};

export const BUYER_PAYMENT_FIXTURE: BuyerPaymentDetails = {
  method: "mobile-banking",
  payableTotal: BUYER_CART_FIXTURE.totals.payableTotal,
  referenceLabel: "bKash 01711 111111",
};

export const BUYER_CONFIRMATION_FIXTURE: BuyerCheckoutConfirmationSnapshot = {
  lines: BUYER_CART_FIXTURE.lines,
  totals: BUYER_CART_FIXTURE.totals,
  fulfillment: BUYER_FULFILLMENT_FIXTURE,
  payment: BUYER_PAYMENT_FIXTURE,
};

export const BUYER_SUCCESS_FIXTURE: BuyerCheckoutSubmitResponse = {
  orderId: "ORD-2404",
  successRoute: "/buyer/orders/success",
};

type BuyerFlowCopy = {
  shellTitle: string;
  shellHint: string;
  stepIntro: string;
  cartHint: string;
  checkoutHint: string;
  fulfillmentHint: string;
  paymentHint: string;
  confirmationHint: string;
  successHint: string;
  continueToFulfillment: string;
  continueToPayment: string;
  continueToConfirmation: string;
  placeOrder: string;
  viewOrders: string;
  pickupChoice: string;
  deliveryChoice: string;
  recipientLabel: string;
  phoneLabel: string;
  addressLabel: string;
  noteLabel: string;
  validationFulfillment: string;
  validationPayment: string;
  validationSubmit: string;
  orderTrackingNote: string;
};

const BUYER_FLOW_COPY: Record<Locale, BuyerFlowCopy> = {
  en: {
    shellTitle: "Buyer workspace",
    shellHint: "Review the cart, complete checkout, and place the order.",
    stepIntro: "Step order",
    cartHint: "Check the items and keep the final amount visible.",
    checkoutHint: "Follow the flow in order so the handoff stays clear.",
    fulfillmentHint: "Add the delivery details before you move on.",
    paymentHint: "Choose one payment method for the order.",
    confirmationHint: "Review the final payable amount before submission.",
    successHint: "The order is placed and the tracking handoff starts here.",
    continueToFulfillment: "Continue to fulfillment",
    continueToPayment: "Continue to payment",
    continueToConfirmation: "Continue to confirmation",
    placeOrder: "Place order",
    viewOrders: "View orders",
    pickupChoice: "Hub pickup",
    deliveryChoice: "Direct delivery",
    recipientLabel: "Recipient",
    phoneLabel: "Phone",
    addressLabel: "Address",
    noteLabel: "Note",
    validationFulfillment: "Add recipient, phone, and address to continue.",
    validationPayment: "Select a payment method to continue.",
    validationSubmit: "Fix the missing details before you place the order.",
    orderTrackingNote: "Order tracking will open in the next slice.",
  },
  bn: {
    shellTitle: "বায়ার কর্মক্ষেত্র",
    shellHint: "কার্ট দেখুন, চেকআউট শেষ করুন, তারপর অর্ডার দিন।",
    stepIntro: "ধাপের ক্রম",
    cartHint: "পণ্য দেখে নিন এবং মোট টাকা পরিষ্কার রাখুন।",
    checkoutHint: "ধাপ ধরে এগোলে হ্যান্ডঅফ সহজ থাকবে।",
    fulfillmentHint: "এগোনোর আগে ডেলিভারির তথ্য দিন।",
    paymentHint: "অর্ডারের জন্য একটি পেমেন্ট পদ্ধতি বাছুন।",
    confirmationHint: "অর্ডার দেওয়ার আগে শেষ পরিশোধ দেখুন।",
    successHint: "অর্ডার সম্পন্ন হয়েছে, ট্র্যাকিং হ্যান্ডঅফ এখানেই শুরু।",
    continueToFulfillment: "ফুলফিলমেন্টে যান",
    continueToPayment: "পেমেন্টে যান",
    continueToConfirmation: "নিশ্চিতকরণে যান",
    placeOrder: "অর্ডার দিন",
    viewOrders: "অর্ডার দেখুন",
    pickupChoice: "হাব থেকে নিন",
    deliveryChoice: "সরাসরি ডেলিভারি",
    recipientLabel: "গ্রহণকারী",
    phoneLabel: "ফোন",
    addressLabel: "ঠিকানা",
    noteLabel: "নোট",
    validationFulfillment: "চালিয়ে যেতে গ্রহণকারী, ফোন, আর ঠিকানা দিন।",
    validationPayment: "চালিয়ে যেতে একটি পেমেন্ট পদ্ধতি বাছুন।",
    validationSubmit: "অর্ডার দেওয়ার আগে ঘাটতি ঠিক করুন।",
    orderTrackingNote: "অর্ডার ট্র্যাকিং পরের স্লাইসে আসবে।",
  },
};

export function getBuyerFlowCopy(locale: Locale) {
  return BUYER_FLOW_COPY[locale] ?? BUYER_FLOW_COPY.bn;
}

export function getBuyerCheckoutCopy(locale: Locale) {
  return getBuyerCartCheckoutCopy(locale);
}

export function formatBuyerMoney(value: number, locale: Locale) {
  try {
    return new Intl.NumberFormat(locale === "bn" ? "bn-BD" : "en-US", {
      style: "currency",
      currency: "BDT",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `৳${value.toLocaleString("en-US")}`;
  }
}

export function getBuyerDetailLineCount(lines: BuyerCartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}
