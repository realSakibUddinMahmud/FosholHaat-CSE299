import type { HubCoordinationResponse, HubLaneKey } from "@fosholhaat/types";

export const HUB_OVERVIEW: HubCoordinationResponse = {
  lanes: [
    { key: "inbound", count: 12, urgentCount: 2 },
    { key: "sorting", count: 4, urgentCount: 1 },
    { key: "dispatch", count: 8, urgentCount: 0 },
    { key: "exceptions", count: 3, urgentCount: 3 },
  ],
  alerts: [
    { id: "hub-alert-01", label: "Inbound truck delayed by 2 hours", severity: "medium" },
    { id: "hub-alert-02", label: "Sorting line 2 blocked", severity: "high" },
  ],
};

export function getHubLaneHref(laneKey: HubLaneKey): string | null {
  if (laneKey === "dispatch") {
    return null;
  }

  if (laneKey === "exceptions") {
    return "/hub/exceptions";
  }

  return `/hub/${laneKey}`;
}
