import type {
  HubDispatchLoadDetail,
  HubDispatchQueueResponse,
} from "@fosholhaat/types";

export const HUB_DISPATCH_QUEUE: HubDispatchQueueResponse = {
  summary: { staging: 1, ready: 1, departed: 1, total: 3 },
  featuredLoadId: "LD-2048",
  activeTab: "staging",
  loads: [
    {
      loadId: "LD-2048",
      routeName: "Dhaka North Cluster",
      destination: "Mirpur, Dhaka",
      corridor: "North corridor",
      status: "staging",
      assignmentState: "unassigned",
      stopCount: 8,
      parcelCount: 42,
      assignee: null,
      assignedAt: null,
      dispatchedAt: null,
    },
    {
      loadId: "LD-2049",
      routeName: "Uttara Line",
      destination: "Uttara, Dhaka",
      corridor: "North corridor",
      status: "ready",
      assignmentState: "assigned",
      stopCount: 6,
      parcelCount: 31,
      assignee: "Dispatch lead",
      assignedAt: "2026-04-20T07:25:00.000Z",
      dispatchedAt: null,
    },
    {
      loadId: "LD-2050",
      routeName: "Gazipur Run",
      destination: "Gazipur",
      corridor: "North corridor",
      status: "departed",
      assignmentState: "assigned",
      stopCount: 9,
      parcelCount: 58,
      assignee: "Driver A",
      assignedAt: "2026-04-20T06:40:00.000Z",
      dispatchedAt: "2026-04-20T07:05:00.000Z",
    },
  ],
};

export const HUB_DISPATCH_DETAILS: Record<string, HubDispatchLoadDetail> = {
  "LD-2048": {
    ...HUB_DISPATCH_QUEUE.loads[0],
    vehicleId: "TRK-11",
    loadingBay: "Bay 2",
    priority: "high",
    note: "Ready for dispatch.",
    updatedAt: "2026-04-20T08:00:00.000Z",
    metric: { stagedParcels: 34, totalParcels: 42, remainingParcels: 8, readinessPercent: 81 },
    manifest: [
      { lotLabel: "Lot 11", productLabel: "Onion sacks", quantityLabel: "18 sacks", verificationLabel: "Checked" },
      { lotLabel: "Lot 18", productLabel: "Potato crates", quantityLabel: "24 crates", verificationLabel: "Pending gate seal" },
    ],
  },
  "LD-2049": {
    ...HUB_DISPATCH_QUEUE.loads[1],
    vehicleId: "TRK-08",
    loadingBay: "Bay 1",
    priority: "normal",
    note: "Driver briefed.",
    updatedAt: "2026-04-20T07:25:00.000Z",
    metric: { stagedParcels: 31, totalParcels: 31, remainingParcels: 0, readinessPercent: 100 },
    manifest: [
      { lotLabel: "Lot 07", productLabel: "Vegetable baskets", quantityLabel: "12 baskets", verificationLabel: "Checked" },
      { lotLabel: "Lot 09", productLabel: "Potato bags", quantityLabel: "19 bags", verificationLabel: "Checked" },
    ],
  },
  "LD-2050": {
    ...HUB_DISPATCH_QUEUE.loads[2],
    vehicleId: "TRK-14",
    loadingBay: "Bay 4",
    priority: "high",
    note: "Left hub on time.",
    updatedAt: "2026-04-20T07:05:00.000Z",
    metric: { stagedParcels: 58, totalParcels: 58, remainingParcels: 0, readinessPercent: 100 },
    manifest: [
      { lotLabel: "Lot 22", productLabel: "Onion sacks", quantityLabel: "26 sacks", verificationLabel: "Checked" },
      { lotLabel: "Lot 27", productLabel: "Vegetable cartons", quantityLabel: "32 cartons", verificationLabel: "Checked" },
    ],
  },
};

export function getHubDispatchDetail(loadId: string) {
  return HUB_DISPATCH_DETAILS[loadId] ?? null;
}
