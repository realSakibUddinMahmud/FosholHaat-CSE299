import type {
  BuyerCartLine,
  BuyerCartTotals,
  BuyerCheckoutConfirmationSnapshot,
  BuyerFulfillmentDetails,
  BuyerPaymentDetails,
  Locale,
} from "@fosholhaat/types";

export const BUYER_WEB_CART_LINES: BuyerCartLine[] = [
  {
    lineId: "CL-9011",
    productId: "P-4011",
    productName: "Potato",
    sellerName: "Kazi Traders",
    quantity: 12,
    unit: "bags",
    unitPrice: 820,
    subtotal: 9840,
    note: "Hub pickup ready.",
  },
  {
    lineId: "CL-9012",
    productId: "P-4012",
    productName: "Onion",
    sellerName: "Rahman Supply",
    quantity: 8,
    unit: "bags",
    unitPrice: 1450,
    subtotal: 11600,
    note: "Grade A only.",
  },
  {
    lineId: "CL-9013",
    productId: "P-4013",
    productName: "Vegetables mix",
    sellerName: "Apon Market Link",
    quantity: 16,
    unit: "crates",
    unitPrice: 860,
    subtotal: 13760,
    note: "Sort before dispatch.",
  },
];

export const BUYER_WEB_CART_TOTALS: BuyerCartTotals = {
  subtotal: 35200,
  deliveryFee: 900,
  serviceFee: 340,
  payableTotal: 36440,
};

export const BUYER_WEB_FULFILLMENT: BuyerFulfillmentDetails = {
  choice: "hub-pickup",
  recipientName: "Aminul Islam",
  phone: "+880 1711 123456",
  addressLabel: "Kaliakoir hub, Gazipur",
  note: "Mobile flow confirms the pickup; web keeps the receipt visible.",
};

export const BUYER_WEB_PAYMENT: BuyerPaymentDetails = {
  method: "mobile-banking",
  payableTotal: BUYER_WEB_CART_TOTALS.payableTotal,
  referenceLabel: "bKash request follows the final review.",
};

export const BUYER_WEB_CONFIRMATION: BuyerCheckoutConfirmationSnapshot = {
  lines: BUYER_WEB_CART_LINES,
  totals: BUYER_WEB_CART_TOTALS,
  fulfillment: BUYER_WEB_FULFILLMENT,
  payment: BUYER_WEB_PAYMENT,
};

export const BUYER_WEB_SUCCESS = {
  orderId: "FH-8492",
  placedAt: "21 Apr 2026, 12:32",
  handoffNote: "Tracking will appear in the buyer-orders slice next.",
  receiptNote: "Keep this receipt for dispatch handoff.",
};

export const BUYER_WEB_CHECKOUT_COPY: Record<
  Locale,
  {
    pageBadge: string;
    cartLead: string;
    checkoutLead: string;
    paymentLead: string;
    confirmationLead: string;
    successLead: string;
    mobileHandoffNote: string;
    trustPoints: string[];
    summaryHints: string[];
    paymentHints: string[];
    receiptHints: string[];
  }
> = {
  en: {
    pageBadge: "Buyer checkout",
    cartLead: "Keep quantity, price, and final payable in view before you continue.",
    checkoutLead:
      "Fulfillment stays in the mobile handoff. Web keeps the summary visible while you move to payment.",
    paymentLead: "Choose a payment method and verify the exact payable amount.",
    confirmationLead:
      "Review delivery details, payment method, and final payable amount one last time.",
    successLead: "Order placed. Keep the receipt for the next buyer-orders flow.",
    mobileHandoffNote: "No separate web fulfillment route is exposed.",
    trustPoints: ["No hidden fees", "Summary stays visible", "Receipt-first handoff"],
    summaryHints: ["Delivery stays explicit", "Final payable stays pinned", "Web handoff only"],
    paymentHints: ["Choose one method", "Reference is shown before submit", "Payment is final review only"],
    receiptHints: ["Use the order ID for support", "Tracking comes in the next slice", "Keep the receipt visible"],
  },
  bn: {
    pageBadge: "বায়ার চেকআউট",
    cartLead: "এগোনোর আগে পরিমাণ, দাম, আর মোট পরিশোধ স্পষ্ট রাখুন।",
    checkoutLead:
      "ফুলফিলমেন্ট মোবাইল হ্যান্ডঅফে থাকে। ওয়েবে শুধু সারসংক্ষেপ দেখিয়ে পেমেন্টে নেওয়া হয়।",
    paymentLead: "একটি পেমেন্ট পদ্ধতি বেছে নিয়ে নির্দিষ্ট মোট পরিশোধ যাচাই করুন।",
    confirmationLead:
      "ডেলিভারি, পেমেন্ট, আর মোট পরিশোধ শেষবারের মতো মিলিয়ে নিন।",
    successLead: "অর্ডার সম্পন্ন হয়েছে। পরের buyer-orders ফ্লোয়ের জন্য রসিদ রাখুন।",
    mobileHandoffNote: "ওয়েবে আলাদা ফুলফিলমেন্ট রুট নেই।",
    trustPoints: ["লুকানো ফি নেই", "সারসংক্ষেপ সবসময় দেখা যায়", "রসিদ আগে"],
    summaryHints: ["ডেলিভারি স্পষ্ট থাকে", "চূড়ান্ত মোট পিন করা থাকে", "শুধু ওয়েব হ্যান্ডঅফ"],
    paymentHints: ["একটি মাধ্যমই বেছে নিন", "সাবমিটের আগে রেফারেন্স দেখানো হয়", "পেমেন্ট শেষ ধাপ"],
    receiptHints: ["সাপোর্টে অর্ডার আইডি ব্যবহার করুন", "ট্র্যাকিং পরের স্লাইসে আসবে", "রসিদ সামনে রাখুন"],
  },
};

export function getBuyerWebCheckoutCopy(locale: Locale) {
  return BUYER_WEB_CHECKOUT_COPY[locale] ?? BUYER_WEB_CHECKOUT_COPY.bn;
}
