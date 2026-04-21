import type { Locale } from "./auth";

export const HUB_DISPATCH_LOAD_STATUSES = [
  "staging",
  "ready",
  "departed",
] as const;
export type HubDispatchLoadStatus = (typeof HUB_DISPATCH_LOAD_STATUSES)[number];

export const HUB_DISPATCH_ASSIGNMENT_STATES = [
  "unassigned",
  "assigned",
  "pending-confirmation",
] as const;
export type HubDispatchAssignmentState =
  (typeof HUB_DISPATCH_ASSIGNMENT_STATES)[number];

export interface HubDispatchQueueSummary {
  staging: number;
  ready: number;
  departed: number;
  total: number;
}

export interface HubDispatchQueueItem {
  loadId: string;
  routeName: string;
  destination: string;
  corridor: string;
  status: HubDispatchLoadStatus;
  assignmentState: HubDispatchAssignmentState;
  stopCount: number;
  parcelCount: number;
  assignee: string | null;
  assignedAt: string | null;
  dispatchedAt: string | null;
}

export interface HubDispatchLoadMetric {
  stagedParcels: number;
  totalParcels: number;
  remainingParcels: number;
  readinessPercent: number;
}

export interface HubDispatchManifestItem {
  lotLabel: string;
  productLabel: string;
  quantityLabel: string;
  verificationLabel: string;
}

export interface HubDispatchLoadDetail extends HubDispatchQueueItem {
  vehicleId: string;
  loadingBay: string;
  priority: "normal" | "high";
  note: string;
  updatedAt: string;
  metric: HubDispatchLoadMetric;
  manifest: HubDispatchManifestItem[];
}

export interface HubDispatchQueueResponse {
  summary: HubDispatchQueueSummary;
  loads: HubDispatchQueueItem[];
  featuredLoadId: string;
  activeTab: HubDispatchLoadStatus;
}

export interface HubDispatchDetailResponse {
  load: HubDispatchLoadDetail;
}

export interface HubDispatchMutationRequest {
  assigneeName?: string;
}

export interface HubDispatchMutationResponse {
  load: HubDispatchLoadDetail;
  feedbackMessage: string;
}

export interface HubDispatchErrorResponse {
  error: {
    code: "LOAD_NOT_FOUND" | "INVALID_TRANSITION";
    message: string;
    loadId: string;
    currentState?: HubDispatchLoadStatus;
    allowed?: HubDispatchLoadStatus[];
  };
}

export type HubDispatchCopy = {
  screenTitle: string;
  hubTitle: string;
  subtitle: string;
  tabs: Record<HubDispatchLoadStatus, string>;
  activeLoading: string;
  readiness: string;
  viewManifest: string;
  currentStatus: string;
  gateAssignment: string;
  loadMetrics: string;
  manifestSummary: string;
  confirmReadiness: string;
  releaseDispatch: string;
  assignLoad: string;
  backToQueue: string;
  stagingNote: string;
  queueEmptyTitle: string;
  queueEmptyBody: string;
  detailNotFoundTitle: string;
  detailNotFoundBody: string;
  statuses: Record<HubDispatchLoadStatus, string>;
  assignmentStates: Record<HubDispatchAssignmentState, string>;
  metrics: {
    staged: string;
    total: string;
    remaining: string;
  };
};

export const HUB_DISPATCH_COPY: Record<Locale, HubDispatchCopy> = {
  en: {
    screenTitle: "Dispatch preparation",
    hubTitle: "Bogura Central Hub",
    subtitle: "Daily dispatch schedule",
    tabs: { staging: "Staging", ready: "Ready", departed: "Departed" },
    activeLoading: "Active loading",
    readiness: "Readiness",
    viewManifest: "View manifest",
    currentStatus: "Current status",
    gateAssignment: "Gate assignment",
    loadMetrics: "Load metrics",
    manifestSummary: "Manifest summary",
    confirmReadiness: "Confirm readiness",
    releaseDispatch: "Release dispatch",
    assignLoad: "Assign load",
    backToQueue: "Back to queue",
    stagingNote: "Staging note",
    queueEmptyTitle: "No dispatch load here now",
    queueEmptyBody: "When a load reaches this step, it will show here.",
    detailNotFoundTitle: "Load not found",
    detailNotFoundBody: "This dispatch load could not be found. Return to the queue.",
    statuses: { staging: "Staging", ready: "Ready", departed: "Departed" },
    assignmentStates: {
      unassigned: "Unassigned",
      assigned: "Assigned",
      "pending-confirmation": "Pending",
    },
    metrics: {
      staged: "Staged",
      total: "Total",
      remaining: "Remaining",
    },
  },
  bn: {
    screenTitle: "ডিসপ্যাচ প্রস্তুতি",
    hubTitle: "বগুড়া সেন্ট্রাল হাব",
    subtitle: "দৈনিক ডিসপ্যাচ তালিকা",
    tabs: { staging: "স্টেজিং", ready: "রেডি", departed: "রওনা" },
    activeLoading: "লোড হচ্ছে",
    readiness: "প্রস্তুতি",
    viewManifest: "ম্যানিফেস্ট দেখুন",
    currentStatus: "এখনকার অবস্থা",
    gateAssignment: "গেট বরাদ্দ",
    loadMetrics: "লোডের হিসাব",
    manifestSummary: "ম্যানিফেস্ট সারসংক্ষেপ",
    confirmReadiness: "প্রস্তুত নিশ্চিত করুন",
    releaseDispatch: "ডিসপ্যাচ ছাড়ুন",
    assignLoad: "লোড দিন",
    backToQueue: "কিউতে ফিরুন",
    stagingNote: "স্টেজিং নোট",
    queueEmptyTitle: "এখন এখানে কোনো লোড নেই",
    queueEmptyBody: "এই ধাপে লোড এলে এখানে দেখাবে।",
    detailNotFoundTitle: "লোড পাওয়া যায়নি",
    detailNotFoundBody: "এই ডিসপ্যাচ লোড পাওয়া যায়নি। কিউতে ফিরে যান।",
    statuses: { staging: "স্টেজিং", ready: "রেডি", departed: "রওনা" },
    assignmentStates: {
      unassigned: "দেওয়া হয়নি",
      assigned: "দেওয়া হয়েছে",
      "pending-confirmation": "অপেক্ষায়",
    },
    metrics: {
      staged: "স্টেজড",
      total: "মোট",
      remaining: "বাকি",
    },
  },
};

export function getHubDispatchCopy(locale: Locale): HubDispatchCopy {
  return HUB_DISPATCH_COPY[locale] ?? HUB_DISPATCH_COPY.bn;
}
