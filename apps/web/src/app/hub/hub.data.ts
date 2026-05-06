import type { HubCoordinationResponse, HubLaneKey } from "@fosholhaat/types";

export const HUB_OVERVIEW: HubCoordinationResponse = {
  lanes: [
    { key: "inbound", count: 0, urgentCount: 0 },
    { key: "sorting", count: 0, urgentCount: 0 },
    { key: "dispatch", count: 0, urgentCount: 0 },
    { key: "exceptions", count: 0, urgentCount: 0 },
  ],
  alerts: [],
};

export function getHubLaneHref(laneKey: HubLaneKey): string | null {
  if (laneKey === "exceptions") {
    return "/hub/exceptions";
  }

  return `/hub/${laneKey}`;
}
