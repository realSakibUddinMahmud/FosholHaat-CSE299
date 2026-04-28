import type {
  InboundReceiptDetail,
  InboundReceiptQueueResponse,
} from "@fosholhaat/types";
import { InboundReceiptStatus } from "@fosholhaat/types";

export const HUB_INBOUND_QUEUE: InboundReceiptQueueResponse = {
  summary: { PENDING: 2, RECEIVED: 1, DISCREPANCY: 1, total: 4 },
  featuredReceiptId: "RC-7801",
  activeTab: InboundReceiptStatus.PENDING,
  receipts: [
    {
      id: "RC-7801",
      supplierName: "Bogura Fresh Supply",
      commodity: "Onion",
      expectedQuantity: 42,
      unit: "bags",
      status: InboundReceiptStatus.PENDING,
      arrivalDate: "2026-04-21",
      arrivalWindowLabel: "09:30-10:00",
      laneLabel: "Inbound Bay 1",
      note: "Pending weigh-in.",
    },
    {
      id: "RC-7802",
      supplierName: "Shibganj Produce Line",
      commodity: "Potato",
      expectedQuantity: 36,
      unit: "crates",
      status: InboundReceiptStatus.RECEIVED,
      arrivalDate: "2026-04-21",
      arrivalWindowLabel: "10:15-10:45",
      laneLabel: "Inbound Bay 2",
      note: "Received after quick count.",
    },
    {
      id: "RC-7803",
      supplierName: "Kahaloo Greens Desk",
      commodity: "Vegetables",
      expectedQuantity: 28,
      unit: "baskets",
      status: InboundReceiptStatus.DISCREPANCY,
      arrivalDate: "2026-04-21",
      arrivalWindowLabel: "11:00-11:30",
      laneLabel: "Inbound Bay 3",
      note: "Weight slip mismatch recorded.",
    },
    {
      id: "RC-7804",
      supplierName: "Sherpur Harvest Link",
      commodity: "Onion",
      expectedQuantity: 18,
      unit: "bags",
      status: InboundReceiptStatus.PENDING,
      arrivalDate: "2026-04-21",
      arrivalWindowLabel: "11:45-12:15",
      laneLabel: "Inbound Bay 4",
      note: "Awaiting receipt confirmation.",
    },
  ],
};

export const HUB_INBOUND_DETAILS: Record<string, InboundReceiptDetail> = {
  "RC-7801": {
    ...HUB_INBOUND_QUEUE.receipts[0],
    receivedAt: null,
    expectedGradeLabel: "Grade A",
    actualGradeLabel: null,
    receiverName: null,
    discrepancy: null,
    nextStepLabel: "Confirm the receipt after final weigh-in.",
  },
  "RC-7802": {
    ...HUB_INBOUND_QUEUE.receipts[1],
    receivedAt: "2026-04-21T04:42:00.000Z",
    expectedGradeLabel: "Grade A",
    actualGradeLabel: "Grade A",
    receiverName: "Hub store lead",
    discrepancy: null,
    nextStepLabel: "Move the receipt toward sorting intake.",
  },
  "RC-7803": {
    ...HUB_INBOUND_QUEUE.receipts[2],
    receivedAt: "2026-04-21T05:10:00.000Z",
    expectedGradeLabel: "Grade B",
    actualGradeLabel: "Grade C",
    receiverName: "Shift lead",
    discrepancy: {
      reportedAt: "2026-04-21T05:12:00.000Z",
      actualQuantity: 24,
      notes: "Four baskets short after manual count.",
    },
    nextStepLabel: "Log the discrepancy before routing to sorting.",
  },
  "RC-7804": {
    ...HUB_INBOUND_QUEUE.receipts[3],
    receivedAt: null,
    expectedGradeLabel: "Grade A",
    actualGradeLabel: null,
    receiverName: null,
    discrepancy: null,
    nextStepLabel: "Wait for the arrival window to open.",
  },
};

export function getHubInboundDetail(receiptId: string) {
  return HUB_INBOUND_DETAILS[receiptId] ?? null;
}
