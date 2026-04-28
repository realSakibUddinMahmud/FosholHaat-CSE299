import type { Locale } from "./auth";

export enum SortingBatchStatus {
  READY = "READY",
  IN_PROGRESS = "IN_PROGRESS",
  HOLD = "HOLD",
  COMPLETE = "COMPLETE",
}

export const SORTING_BATCH_STATUS_ORDER = [
  SortingBatchStatus.READY,
  SortingBatchStatus.IN_PROGRESS,
  SortingBatchStatus.HOLD,
  SortingBatchStatus.COMPLETE,
] as const;

export const SORTING_HOLD_REASONS = [
  "quality-check",
  "count-mismatch",
  "label-review",
] as const;
export type SortingHoldReason = (typeof SORTING_HOLD_REASONS)[number];

export interface SortingBatchQueueSummary {
  READY: number;
  IN_PROGRESS: number;
  HOLD: number;
  COMPLETE: number;
  total: number;
}

export interface SortingBatchSummary {
  batchId: string;
  commodityLabel: string;
  expectedQuantityLabel: string;
  laneLabel: string;
  status: SortingBatchStatus;
  nextActionLabel: string;
  updatedAtLabel: string;
}

export interface SortingBatchItemGroup {
  label: string;
  quantityLabel: string;
}

export interface SortingBatchHoldRecord {
  reason: SortingHoldReason;
  reasonLabel: string;
  note: string;
  reportedAt: string;
}

export interface SortingBatchDetail extends SortingBatchSummary {
  receiverLabel: string;
  itemGroups: SortingBatchItemGroup[];
  holdRecord: SortingBatchHoldRecord | null;
}

export interface SortingQueueResponse {
  summary: SortingBatchQueueSummary;
  activeTab: SortingBatchStatus;
  featuredBatchId: string;
  batches: SortingBatchSummary[];
}

export interface SortingBatchDetailResponse {
  batch: SortingBatchDetail;
}

export interface SortingBatchTransitionPayload {
  operatorName?: string;
}

export interface SortingBatchHoldPayload {
  reason: SortingHoldReason;
  note: string;
}

export interface SortingBatchMutationResponse {
  batch: SortingBatchDetail;
  feedbackMessage: string;
}

export interface SortingBatchErrorResponse {
  error: {
    code:
      | "BATCH_NOT_FOUND"
      | "INVALID_BATCH_TRANSITION"
      | "MISSING_HOLD_REASON";
    message: string;
    batchId: string;
  };
}

export type HubSortingCopy = {
  screenTitle: string;
  heroTitle: string;
  heroSubtitle: string;
  activeLabel: string;
  queueEmptyTitle: string;
  queueEmptyBody: string;
  detailNotFoundTitle: string;
  detailNotFoundBody: string;
  backToQueue: string;
  statuses: Record<SortingBatchStatus, string>;
  tabs: Record<SortingBatchStatus, string>;
  holdReasons: Record<SortingHoldReason, string>;
  labels: {
    lane: string;
    receiver: string;
    nextAction: string;
    holdReason: string;
    itemMix: string;
    note: string;
  };
  actions: {
    start: string;
    hold: string;
    complete: string;
  };
  feedback: {
    started: string;
    held: string;
    completed: string;
  };
};

export const HUB_SORTING_COPY: Record<Locale, HubSortingCopy> = {
  en: {
    screenTitle: "Sorting operations",
    heroTitle: "Sorting batch queue",
    heroSubtitle:
      "Review sorting batches, spot hold states fast, and move one batch through bounded actions.",
    activeLabel: "Active sorting",
    queueEmptyTitle: "No sorting batch here now",
    queueEmptyBody: "When a batch reaches this step, it will show here.",
    detailNotFoundTitle: "Batch not found",
    detailNotFoundBody: "This sorting batch is no longer available. Return to the queue.",
    backToQueue: "Back to queue",
    statuses: {
      READY: "Ready",
      IN_PROGRESS: "In progress",
      HOLD: "Hold",
      COMPLETE: "Complete",
    },
    tabs: {
      READY: "Ready",
      IN_PROGRESS: "Active",
      HOLD: "Hold",
      COMPLETE: "Complete",
    },
    holdReasons: {
      "quality-check": "Quality check",
      "count-mismatch": "Count mismatch",
      "label-review": "Label review",
    },
    labels: {
      lane: "Sorting lane",
      receiver: "Sorting lead",
      nextAction: "Next action",
      holdReason: "Hold reason",
      itemMix: "Commodity mix",
      note: "Sorting note",
    },
    actions: {
      start: "Start batch",
      hold: "Hold batch",
      complete: "Complete batch",
    },
    feedback: {
      started: "Batch started.",
      held: "Batch moved to hold.",
      completed: "Batch completed.",
    },
  },
  bn: {
    screenTitle: "সোর্টিং অপারেশন",
    heroTitle: "সোর্টিং ব্যাচ কিউ",
    heroSubtitle:
      "সোর্টিং ব্যাচ দেখুন, hold অবস্থা দ্রুত চিনুন, আর সীমিত action দিয়ে ব্যাচ এগিয়ে নিন।",
    activeLabel: "সক্রিয় সোর্টিং",
    queueEmptyTitle: "এখন এখানে কোনো সোর্টিং ব্যাচ নেই",
    queueEmptyBody: "এই ধাপে ব্যাচ এলে এখানে দেখাবে।",
    detailNotFoundTitle: "ব্যাচ পাওয়া যায়নি",
    detailNotFoundBody: "এই সোর্টিং ব্যাচ আর পাওয়া যাচ্ছে না। কিউতে ফিরে যান।",
    backToQueue: "কিউতে ফিরুন",
    statuses: {
      READY: "রেডি",
      IN_PROGRESS: "চলমান",
      HOLD: "হোল্ড",
      COMPLETE: "সম্পন্ন",
    },
    tabs: {
      READY: "রেডি",
      IN_PROGRESS: "চলমান",
      HOLD: "হোল্ড",
      COMPLETE: "সম্পন্ন",
    },
    holdReasons: {
      "quality-check": "মান যাচাই",
      "count-mismatch": "গণনা গরমিল",
      "label-review": "লেবেল রিভিউ",
    },
    labels: {
      lane: "সোর্টিং লেন",
      receiver: "সোর্টিং লিড",
      nextAction: "পরের ধাপ",
      holdReason: "হোল্ডের কারণ",
      itemMix: "পণ্যের মিশ্রণ",
      note: "সোর্টিং নোট",
    },
    actions: {
      start: "ব্যাচ শুরু করুন",
      hold: "ব্যাচ হোল্ড করুন",
      complete: "ব্যাচ সম্পন্ন করুন",
    },
    feedback: {
      started: "ব্যাচ শুরু হয়েছে।",
      held: "ব্যাচ হোল্ডে গেছে।",
      completed: "ব্যাচ সম্পন্ন হয়েছে।",
    },
  },
};

export function getHubSortingCopy(locale: Locale): HubSortingCopy {
  return HUB_SORTING_COPY[locale] ?? HUB_SORTING_COPY.bn;
}
