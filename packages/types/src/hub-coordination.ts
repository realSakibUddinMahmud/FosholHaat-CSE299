import { Locale } from "./auth";

export type HubLaneKey = "inbound" | "sorting" | "dispatch" | "exceptions";
export type HubAlertSeverity = "low" | "medium" | "high";

export interface HubCoordinationLane {
  key: HubLaneKey;
  count: number;
  urgentCount?: number;
}

export interface HubCoordinationAlert {
  id: string;
  label: string;
  severity: HubAlertSeverity;
}

export interface HubCoordinationResponse {
  lanes: HubCoordinationLane[];
  alerts: HubCoordinationAlert[];
}

export interface HubCoordinationAssignmentPayload {
  laneKey: HubLaneKey;
  assigneeId: string;
}

export interface HubCoordinationAssignmentResponse {
  success: true;
  message: string;
  assignment: HubCoordinationAssignmentPayload;
}

export interface HubReceiveHandoffPayload {
  handoffCode: string;
  sealCode: string;
  discrepancyNotes?: string;
}

export interface HubReceiveHandoffResponse {
  success: true;
  orderCode: string;
  handoffCode: string;
  status: "HUB_RECEIVED" | "DISCREPANCY";
  message: string;
}

export type HubCoordinationCopy = {
  screenTitle: string;
  screenSubtitle: string;
  lanes: {
    inbound: string;
    sorting: string;
    dispatch: string;
    exceptions: string;
  };
  labels: {
    urgent: string;
    items: string;
    alerts: string;
    assign: string;
    assignee: string;
    save: string;
    openWorkspace: string;
    mobileOnly: string;
  };
  emptyState: {
    title: string;
    body: string;
  };
};

export const HUB_COORDINATION_COPY: Record<Locale, HubCoordinationCopy> = {
  en: {
    screenTitle: "Hub coordination",
    screenSubtitle: "See lane pressure, urgent work, and who owns the next move.",
    lanes: {
      inbound: "Inbound",
      sorting: "Sorting",
      dispatch: "Dispatch",
      exceptions: "Exceptions",
    },
    labels: {
      urgent: "Urgent",
      items: "items",
      alerts: "Active alerts",
      assign: "Assign lane",
      assignee: "Assignee ID",
      save: "Save assignment",
      openWorkspace: "Open coordination workspace",
      mobileOnly: "Mobile handoff only",
    },
    emptyState: {
      title: "All clear",
      body: "There are no pending items or alerts in the hub right now.",
    },
  },
  bn: {
    screenTitle: "হাব কোঅর্ডিনেশন",
    screenSubtitle: "কোন লেনে চাপ বেশি, কোথায় জরুরি কাজ, আর কার দায়িত্ব আছে তা দেখুন।",
    lanes: {
      inbound: "ইনবাউন্ড",
      sorting: "সোর্টিং",
      dispatch: "ডিসপ্যাচ",
      exceptions: "এক্সেপশন",
    },
    labels: {
      urgent: "জরুরি",
      items: "আইটেম",
      alerts: "সক্রিয় অ্যালার্ট",
      assign: "লেন অ্যাসাইন করুন",
      assignee: "অ্যাসাইনি আইডি",
      save: "অ্যাসাইনমেন্ট সেভ করুন",
      openWorkspace: "কোঅর্ডিনেশন ওয়ার্কস্পেস খুলুন",
      mobileOnly: "শুধু মোবাইল হ্যান্ডঅফ",
    },
    emptyState: {
      title: "সব ক্লিয়ার",
      body: "এখন হাবে কোনো পেন্ডিং আইটেম বা অ্যালার্ট নেই।",
    },
  },
};

export function getHubCoordinationCopy(locale: Locale): HubCoordinationCopy {
  return HUB_COORDINATION_COPY[locale] ?? HUB_COORDINATION_COPY.bn;
}
