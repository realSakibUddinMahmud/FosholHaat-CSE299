import type { SortingBatchDetail, SortingQueueResponse } from "@fosholhaat/types";
import { SortingBatchStatus } from "@fosholhaat/types";

export const HUB_SORTING_QUEUE: SortingQueueResponse = {
  summary: { READY: 2, IN_PROGRESS: 1, HOLD: 1, COMPLETE: 0, total: 4 },
  featuredBatchId: "SB-9101",
  activeTab: SortingBatchStatus.READY,
  batches: [
    {
      batchId: "SB-9101",
      commodityLabel: "Onion",
      expectedQuantityLabel: "42 bags",
      laneLabel: "Sorting Bay 1",
      status: SortingBatchStatus.READY,
      nextActionLabel: "Start the first sort pass.",
      updatedAtLabel: "2026-04-21T07:20:00.000Z",
    },
    {
      batchId: "SB-9102",
      commodityLabel: "Potato",
      expectedQuantityLabel: "36 crates",
      laneLabel: "Sorting Bay 2",
      status: SortingBatchStatus.IN_PROGRESS,
      nextActionLabel: "Continue pallet split.",
      updatedAtLabel: "2026-04-21T07:34:00.000Z",
    },
    {
      batchId: "SB-9103",
      commodityLabel: "Vegetables",
      expectedQuantityLabel: "28 baskets",
      laneLabel: "Sorting Bay 3",
      status: SortingBatchStatus.HOLD,
      nextActionLabel: "Resolve the count mismatch.",
      updatedAtLabel: "2026-04-21T07:38:00.000Z",
    },
    {
      batchId: "SB-9104",
      commodityLabel: "Onion",
      expectedQuantityLabel: "18 bags",
      laneLabel: "Sorting Bay 4",
      status: SortingBatchStatus.READY,
      nextActionLabel: "Queue for the next operator.",
      updatedAtLabel: "2026-04-21T07:41:00.000Z",
    },
  ],
};

export const HUB_SORTING_DETAILS: Record<string, SortingBatchDetail> = {
  "SB-9101": {
    ...HUB_SORTING_QUEUE.batches[0],
    receiverLabel: "Sort lead",
    itemGroups: [
      { label: "Grade A", quantityLabel: "24 bags" },
      { label: "Grade B", quantityLabel: "18 bags" },
    ],
    holdRecord: null,
  },
  "SB-9102": {
    ...HUB_SORTING_QUEUE.batches[1],
    receiverLabel: "Shift lead",
    itemGroups: [
      { label: "Pallet split", quantityLabel: "20 crates" },
      { label: "Overflow", quantityLabel: "16 crates" },
    ],
    holdRecord: null,
  },
  "SB-9103": {
    ...HUB_SORTING_QUEUE.batches[2],
    receiverLabel: "Hold desk",
    itemGroups: [
      { label: "Grade A", quantityLabel: "19 baskets" },
      { label: "Recount", quantityLabel: "9 baskets" },
    ],
    holdRecord: {
      reason: "count-mismatch",
      reasonLabel: "Count mismatch",
      note: "Two baskets need a recount before completion.",
      reportedAt: "2026-04-21T07:39:00.000Z",
    },
  },
  "SB-9104": {
    ...HUB_SORTING_QUEUE.batches[3],
    receiverLabel: "Night lead",
    itemGroups: [
      { label: "Reserve", quantityLabel: "10 bags" },
      { label: "Overflow", quantityLabel: "8 bags" },
    ],
    holdRecord: null,
  },
};

export function getHubSortingDetail(batchId: string) {
  return HUB_SORTING_DETAILS[batchId] ?? null;
}
