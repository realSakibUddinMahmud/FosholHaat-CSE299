import type { HubCoordinationResponse, HubLaneKey, Locale } from "@fosholhaat/types";

export const HUB_OVERVIEW: HubCoordinationResponse = {
  lanes: [
    { key: "inbound", count: 14, urgentCount: 0 },
    { key: "sorting", count: 3, urgentCount: 0 },
    { key: "dispatch", count: 8, urgentCount: 0 },
    { key: "exceptions", count: 3, urgentCount: 3 },
  ],
  alerts: [
    { id: "hub-alert-01", label: "Waiting for Batch #B-4412", severity: "medium" },
    { id: "hub-alert-02", label: "On schedule for 4PM Dispatch", severity: "low" },
  ],
};

export type CoordinationFeedItem = {
  id: string;
  laneKey: HubLaneKey;
  visibilityLabel: Record<Locale, string>;
  title: string;
  urgent: boolean;
  progressLabels: Record<Locale, [string, string, string]>;
  progressValue: [number, number, number];
  alertLabel: Record<Locale, string>;
  alertTone: "warning" | "calm" | "info";
  assigneeCount: number;
};

export const HUB_COORDINATION_FEED: CoordinationFeedItem[] = [
  {
    id: "coord-1",
    laneKey: "sorting",
    visibilityLabel: {
      en: "VISIBLE TO BUYER: PROCESSING",
      bn: "ক্রেতা যেটা দেখবে: প্রসেসিং",
    },
    title: "Lot #L-8821 → Order #OR-552",
    urgent: true,
    progressLabels: {
      en: ["INTAKE (VERIFIED)", "SORTING (5%)", "DISPATCH (PENDING)"],
      bn: ["ইনটেক (যাচাই)", "সোর্টিং (৫%)", "ডিসপ্যাচ (অপেক্ষমান)"],
    },
    progressValue: [1, 0.65, 0.22],
    alertLabel: {
      en: "Waiting for Batch #B-4412",
      bn: "ব্যাচ #B-4412-এর জন্য অপেক্ষা করছে",
    },
    alertTone: "warning",
    assigneeCount: 2,
  },
  {
    id: "coord-2",
    laneKey: "dispatch",
    visibilityLabel: {
      en: "VISIBLE TO BUYER: SORTING",
      bn: "ক্রেতা যেটা দেখবে: সোর্টিং",
    },
    title: "Lot #L-9014 → Order #OR-558",
    urgent: false,
    progressLabels: {
      en: ["INTAKE (VERIFIED)", "SORTING (25%)", "DISPATCH"],
      bn: ["ইনটেক (যাচাই)", "সোর্টিং (২৫%)", "ডিসপ্যাচ"],
    },
    progressValue: [1, 0.75, 0.34],
    alertLabel: {
      en: "Ready for Truck Assignment",
      bn: "ট্রাক অ্যাসাইনমেন্টের জন্য প্রস্তুত",
    },
    alertTone: "info",
    assigneeCount: 1,
  },
];

export function getHubLaneRoute(
  laneKey: HubLaneKey,
): "/hub/inbound" | "/hub/sorting" | "/hub/dispatch" | "/hub/exceptions" {
  if (laneKey === "exceptions") return "/hub/exceptions";
  return `/hub/${laneKey}`;
}
