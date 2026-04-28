import type { Locale } from "./auth";

export enum InboundReceiptStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
  DISCREPANCY = "DISCREPANCY",
}

export const INBOUND_RECEIPT_STATUS_ORDER = [
  InboundReceiptStatus.PENDING,
  InboundReceiptStatus.RECEIVED,
  InboundReceiptStatus.DISCREPANCY,
] as const;

export interface InboundReceiptQueueSummary {
  PENDING: number;
  RECEIVED: number;
  DISCREPANCY: number;
  total: number;
}

export interface InboundReceiptSummary {
  id: string;
  supplierName: string;
  commodity: string;
  expectedQuantity: number;
  unit: string;
  status: InboundReceiptStatus;
  arrivalDate: string;
  arrivalWindowLabel: string;
  laneLabel: string;
  note: string;
}

export interface DiscrepancyRecord {
  reportedAt: string;
  actualQuantity: number;
  notes: string;
}

export interface InboundReceiptDetail extends InboundReceiptSummary {
  receivedAt: string | null;
  expectedGradeLabel: string;
  actualGradeLabel: string | null;
  receiverName: string | null;
  discrepancy: DiscrepancyRecord | null;
  nextStepLabel: string;
}

export interface InboundReceiptQueueResponse {
  summary: InboundReceiptQueueSummary;
  activeTab: InboundReceiptStatus;
  featuredReceiptId: string;
  receipts: InboundReceiptSummary[];
}

export interface InboundReceiptDetailResponse {
  receipt: InboundReceiptDetail;
}

export interface ReceiveReceiptPayload {
  receiverName?: string;
}

export interface ReportDiscrepancyPayload {
  actualQuantity: number;
  notes: string;
}

export interface InboundReceiptMutationResponse {
  receipt: InboundReceiptDetail;
  feedbackMessage: string;
}

export interface InboundReceiptErrorResponse {
  error: {
    code:
      | "RECEIPT_NOT_FOUND"
      | "INVALID_DISCREPANCY_PAYLOAD"
      | "DUPLICATE_RECEIVE_TRANSITION";
    message: string;
    receiptId: string;
  };
}

export type HubInboundCopy = {
  screenTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  activeLabel: string;
  queueEmptyTitle: string;
  queueEmptyBody: string;
  detailNotFoundTitle: string;
  detailNotFoundBody: string;
  backToQueue: string;
  statuses: Record<InboundReceiptStatus, string>;
  tabs: Record<InboundReceiptStatus, string>;
  labels: {
    expected: string;
    actual: string;
    lane: string;
    arrival: string;
    receiver: string;
    nextStep: string;
    discrepancy: string;
    note: string;
  };
  actions: {
    receive: string;
    discrepancy: string;
  };
  feedback: {
    received: string;
    discrepancy: string;
  };
};

export const HUB_INBOUND_COPY: Record<Locale, HubInboundCopy> = {
  en: {
    screenTitle: "Inbound operations",
    heroTitle: "Inbound receipt queue",
    heroSubtitle:
      "Review incoming produce, confirm receipt, and log mismatches before sorting starts.",
    activeLabel: "Active inbound",
    queueEmptyTitle: "No inbound receipt here now",
    queueEmptyBody: "When a receipt reaches this step, it will show here.",
    detailNotFoundTitle: "Receipt not found",
    detailNotFoundBody:
      "This inbound receipt is no longer available. Return to the queue.",
    backToQueue: "Back to queue",
    statuses: {
      PENDING: "Pending",
      RECEIVED: "Received",
      DISCREPANCY: "Discrepancy",
    },
    tabs: {
      PENDING: "Pending",
      RECEIVED: "Received",
      DISCREPANCY: "Discrepancy",
    },
    labels: {
      expected: "Expected quantity",
      actual: "Actual quantity",
      lane: "Inbound lane",
      arrival: "Arrival window",
      receiver: "Receiver",
      nextStep: "Next step",
      discrepancy: "Discrepancy note",
      note: "Inbound note",
    },
    actions: {
      receive: "Confirm receipt",
      discrepancy: "Report discrepancy",
    },
    feedback: {
      received: "Receipt confirmed.",
      discrepancy: "Discrepancy logged.",
    },
  },
  bn: {
    screenTitle: "ইনবাউন্ড অপারেশন",
    heroTitle: "ইনবাউন্ড রিসিপ্ট কিউ",
    heroSubtitle:
      "পণ্য আসার পর রিসিপ্ট দেখুন, গ্রহণ নিশ্চিত করুন, আর সোর্টিংয়ের আগে গরমিল নোট করুন।",
    activeLabel: "সক্রিয় ইনবাউন্ড",
    queueEmptyTitle: "এখন এখানে কোনো রিসিপ্ট নেই",
    queueEmptyBody: "এই ধাপে রিসিপ্ট এলে এখানে দেখাবে।",
    detailNotFoundTitle: "রিসিপ্ট পাওয়া যায়নি",
    detailNotFoundBody:
      "এই ইনবাউন্ড রিসিপ্ট আর পাওয়া যাচ্ছে না। কিউতে ফিরে যান।",
    backToQueue: "কিউতে ফিরুন",
    statuses: {
      PENDING: "অপেক্ষায়",
      RECEIVED: "গ্রহণ হয়েছে",
      DISCREPANCY: "গরমিল",
    },
    tabs: {
      PENDING: "অপেক্ষায়",
      RECEIVED: "গ্রহণ",
      DISCREPANCY: "গরমিল",
    },
    labels: {
      expected: "প্রত্যাশিত পরিমাণ",
      actual: "আসল পরিমাণ",
      lane: "ইনবাউন্ড লেন",
      arrival: "আগমনের সময়",
      receiver: "গ্রহণকারী",
      nextStep: "পরের ধাপ",
      discrepancy: "গরমিলের নোট",
      note: "ইনবাউন্ড নোট",
    },
    actions: {
      receive: "গ্রহণ নিশ্চিত করুন",
      discrepancy: "গরমিল লিখুন",
    },
    feedback: {
      received: "রিসিপ্ট গ্রহণ নিশ্চিত হয়েছে।",
      discrepancy: "গরমিল নথিভুক্ত হয়েছে।",
    },
  },
};

export function getHubInboundCopy(locale: Locale): HubInboundCopy {
  return HUB_INBOUND_COPY[locale] ?? HUB_INBOUND_COPY.bn;
}
