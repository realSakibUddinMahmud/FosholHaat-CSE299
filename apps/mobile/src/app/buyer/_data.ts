import type { BuyerCartLine, Locale } from "@fosholhaat/types";
import { getBuyerCartCheckoutCopy } from "@fosholhaat/types";

export type BuyerStepKey = "cart" | "fulfillment" | "payment" | "confirmation";

export const BUYER_STEP_ORDER: BuyerStepKey[] = [
  "cart",
  "fulfillment",
  "payment",
  "confirmation",
];

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
    orderTrackingNote: "Track this order from the Orders tab.",
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
    orderTrackingNote: "অর্ডার ট্যাব থেকে এই অর্ডার ট্র্যাক করুন।",
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
