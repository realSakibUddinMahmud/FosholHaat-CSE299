import type { Locale } from "./auth";

export const HUB_EXCEPTION_SEVERITIES = [
  "documentation",
  "high-priority",
  "critical",
] as const;
export type HubExceptionSeverity = (typeof HUB_EXCEPTION_SEVERITIES)[number];

export const HUB_EXCEPTION_STATUS_TABS = [
  "active",
  "waiting-review",
  "resolved",
] as const;
export type HubExceptionStatusTab = (typeof HUB_EXCEPTION_STATUS_TABS)[number];

export const HUB_EXCEPTION_ACTIONS = ["resolve", "escalate", "hold"] as const;
export type HubExceptionAction = (typeof HUB_EXCEPTION_ACTIONS)[number];

export interface HubExceptionSummary {
  exceptionId: string;
  statusTab: HubExceptionStatusTab;
  severity: HubExceptionSeverity;
  title: string;
  lotLabel: string;
  laneLabel: string;
  buyerVisibilityLabel: string;
  recommendedActionLabel: string;
  createdAgoLabel: string;
}

export interface HubExceptionTimelineEvent {
  id: string;
  label: string;
  timeLabel: string;
}

export interface HubExceptionDetail extends HubExceptionSummary {
  description: string;
  sourceLabel: string;
  nextActionLabel: string;
  actionOptions: HubExceptionAction[];
  timeline: HubExceptionTimelineEvent[];
}

export interface HubExceptionListSummary {
  active: number;
  "waiting-review": number;
  resolved: number;
  total: number;
}

export interface HubExceptionListResponse {
  summary: HubExceptionListSummary;
  featuredExceptionId: string;
  activeTab: HubExceptionStatusTab;
  exceptions: HubExceptionSummary[];
}

export interface HubExceptionDetailResponse {
  exception: HubExceptionDetail;
}

export interface HubExceptionMutationRequest {
  note?: string;
  targetOwner?: string;
}

export interface HubExceptionMutationResponse {
  exception: HubExceptionDetail;
  feedbackMessage: string;
}

export interface HubExceptionErrorResponse {
  error: {
    code:
      | "EXCEPTION_NOT_FOUND"
      | "INVALID_ACTION"
      | "INVALID_TARGET"
      | "INVALID_TRANSITION";
    message: string;
    exceptionId: string;
    allowed?: string[];
  };
}

export type HubExceptionCopy = {
  screenTitle: string;
  tabs: Record<HubExceptionStatusTab, string>;
  listEmptyTitle: string;
  listEmptyBody: string;
  detailNotFoundTitle: string;
  detailNotFoundBody: string;
  severityLabels: Record<HubExceptionSeverity, string>;
  actionLabels: Record<HubExceptionAction, string>;
  buyerVisibility: string;
  source: string;
  timeline: string;
  backToList: string;
};

export const HUB_EXCEPTION_COPY: Record<Locale, HubExceptionCopy> = {
  en: {
    screenTitle: "Exceptions & Alerts",
    tabs: {
      active: "Active",
      "waiting-review": "Waiting Review",
      resolved: "Resolved",
    },
    listEmptyTitle: "No exception here now",
    listEmptyBody: "When a new issue appears, it will show here.",
    detailNotFoundTitle: "Exception not found",
    detailNotFoundBody:
      "This issue is no longer available. Return to the exceptions list.",
    severityLabels: {
      documentation: "Documentation",
      "high-priority": "High Priority",
      critical: "Critical",
    },
    actionLabels: {
      resolve: "Resolve",
      escalate: "Escalate",
      hold: "Hold",
    },
    buyerVisibility: "Buyer visibility",
    source: "Source",
    timeline: "Timeline",
    backToList: "Back to exceptions",
  },
  bn: {
    screenTitle: "ব্যতিক্রম ও সতর্কতা",
    tabs: {
      active: "সক্রিয়",
      "waiting-review": "রিভিউ অপেক্ষায়",
      resolved: "সমাধান",
    },
    listEmptyTitle: "এখন কোনো সমস্যা নেই",
    listEmptyBody: "নতুন সমস্যা এলে এখানে দেখা যাবে।",
    detailNotFoundTitle: "সমস্যা পাওয়া যায়নি",
    detailNotFoundBody: "এই বিষয়টি আর পাওয়া যাচ্ছে না। তালিকায় ফিরে যান।",
    severityLabels: {
      documentation: "ডকুমেন্টেশন",
      "high-priority": "উচ্চ অগ্রাধিকার",
      critical: "গুরুতর",
    },
    actionLabels: {
      resolve: "সমাধান",
      escalate: "এস্কেলেট",
      hold: "হোল্ড",
    },
    buyerVisibility: "ক্রেতা ভিজিবিলিটি",
    source: "উৎস",
    timeline: "টাইমলাইন",
    backToList: "তালিকায় ফিরুন",
  },
};

export function getHubExceptionCopy(locale: Locale): HubExceptionCopy {
  return HUB_EXCEPTION_COPY[locale] ?? HUB_EXCEPTION_COPY.bn;
}
