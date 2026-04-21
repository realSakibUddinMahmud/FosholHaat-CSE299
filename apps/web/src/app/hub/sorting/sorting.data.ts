import type {
  SortingBatchDetail,
  SortingQueueResponse,
} from "@fosholhaat/types";
import { SortingBatchStatus } from "@fosholhaat/types";

export const HUB_SORTING_QUEUE: SortingQueueResponse = {
  summary: {
    READY: 1,
    IN_PROGRESS: 1,
    HOLD: 1,
    COMPLETE: 1,
    total: 4,
  },
  activeTab: SortingBatchStatus.IN_PROGRESS,
  featuredBatchId: "SB-9102",
  batches: [
    {
      batchId: "SB-9101",
      commodityLabel: "Potato",
      expectedQuantityLabel: "820 bags",
      laneLabel: "Lane A",
      status: SortingBatchStatus.READY,
      nextActionLabel: "Assign sorter and start the run.",
      updatedAtLabel: "21 Apr 2026, 08:45",
    },
    {
      batchId: "SB-9102",
      commodityLabel: "Onion",
      expectedQuantityLabel: "540 bags",
      laneLabel: "Lane B",
      status: SortingBatchStatus.IN_PROGRESS,
      nextActionLabel: "Keep the batch moving and check the hold gate.",
      updatedAtLabel: "21 Apr 2026, 10:22",
    },
    {
      batchId: "SB-9103",
      commodityLabel: "Vegetables",
      expectedQuantityLabel: "310 crates",
      laneLabel: "Lane C",
      status: SortingBatchStatus.HOLD,
      nextActionLabel: "Review the hold note before release.",
      updatedAtLabel: "21 Apr 2026, 11:05",
    },
    {
      batchId: "SB-9104",
      commodityLabel: "Potato",
      expectedQuantityLabel: "680 bags",
      laneLabel: "Lane D",
      status: SortingBatchStatus.COMPLETE,
      nextActionLabel: "Batch closed and ready for downstream handoff.",
      updatedAtLabel: "21 Apr 2026, 11:48",
    },
  ],
};

export const HUB_SORTING_DETAILS: Record<string, SortingBatchDetail> = {
  "SB-9101": {
    ...HUB_SORTING_QUEUE.batches[0],
    receiverLabel: "Aminul Islam",
    itemGroups: [
      { label: "Grade A", quantityLabel: "560 bags" },
      { label: "Grade B", quantityLabel: "260 bags" },
    ],
    holdRecord: null,
  },
  "SB-9102": {
    ...HUB_SORTING_QUEUE.batches[1],
    receiverLabel: "Rashed Khan",
    itemGroups: [
      { label: "Grade A", quantityLabel: "320 bags" },
      { label: "Grade B", quantityLabel: "220 bags" },
    ],
    holdRecord: null,
  },
  "SB-9103": {
    ...HUB_SORTING_QUEUE.batches[2],
    receiverLabel: "Mim Akter",
    itemGroups: [
      { label: "Grade A", quantityLabel: "180 crates" },
      { label: "Grade C", quantityLabel: "130 crates" },
    ],
    holdRecord: {
      reason: "count-mismatch",
      reasonLabel: "Count mismatch",
      note: "Twelve crates are missing against the gate tally.",
      reportedAt: "21 Apr 2026, 11:02",
    },
  },
  "SB-9104": {
    ...HUB_SORTING_QUEUE.batches[3],
    receiverLabel: "Nusrat Jahan",
    itemGroups: [
      { label: "Grade A", quantityLabel: "420 bags" },
      { label: "Grade B", quantityLabel: "260 bags" },
    ],
    holdRecord: null,
  },
};
