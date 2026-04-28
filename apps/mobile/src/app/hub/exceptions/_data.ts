import type {
  HubExceptionDetail,
  HubExceptionListResponse,
} from "@fosholhaat/types";

export const HUB_EXCEPTION_LIST: HubExceptionListResponse = {
  summary: { active: 2, "waiting-review": 1, resolved: 1, total: 4 },
  featuredExceptionId: "EX-4101",
  activeTab: "active",
  exceptions: [
    {
      exceptionId: "EX-4101",
      statusTab: "active",
      severity: "high-priority",
      title: "Grade Variance: Onions",
      lotLabel: "Lot #LOT-4832",
      laneLabel: "Warehouse A",
      buyerVisibilityLabel: "Buyer Visibility: Delayed on Marketplace",
      recommendedActionLabel: "Update Status",
      createdAgoLabel: "2m ago",
    },
    {
      exceptionId: "EX-4102",
      statusTab: "active",
      severity: "critical",
      title: "Weight Discrepancy: Potatoes",
      lotLabel: "Lot #LOT-5921",
      laneLabel: "Processing Hub",
      buyerVisibilityLabel: "Buyer Visibility: Visible",
      recommendedActionLabel: "Resolve Discrepancy",
      createdAgoLabel: "15m ago",
    },
    {
      exceptionId: "EX-4103",
      statusTab: "waiting-review",
      severity: "documentation",
      title: "Missing Origin Certificate",
      lotLabel: "Lot #LOT-4890",
      laneLabel: "Inbound Queue",
      buyerVisibilityLabel: "Buyer Visibility: Hidden",
      recommendedActionLabel: "Upload File",
      createdAgoLabel: "1h ago",
    },
    {
      exceptionId: "EX-4104",
      statusTab: "resolved",
      severity: "documentation",
      title: "Coordination Reminder Closed",
      lotLabel: "Lot #LOT-2210",
      laneLabel: "Command Desk",
      buyerVisibilityLabel: "Buyer Visibility: Visible",
      recommendedActionLabel: "Resolved",
      createdAgoLabel: "2h ago",
    },
  ],
};

export const HUB_EXCEPTION_DETAILS: Record<string, HubExceptionDetail> = {
  "EX-4101": {
    ...HUB_EXCEPTION_LIST.exceptions[0],
    description: "Onion grade at the gate does not match the expected batch note.",
    sourceLabel: "Inbound dock 2",
    nextActionLabel: "Recheck grade and update buyer visibility.",
    actionOptions: ["resolve", "escalate", "hold"],
    timeline: [
      { id: "ex1-1", label: "Gate variance flagged", timeLabel: "2m ago" },
      { id: "ex1-2", label: "Shift lead informed", timeLabel: "1m ago" },
    ],
  },
  "EX-4102": {
    ...HUB_EXCEPTION_LIST.exceptions[1],
    description: "Potato load weight is outside the confirmed dispatch range.",
    sourceLabel: "Processing bay 1",
    nextActionLabel: "Resolve discrepancy before dispatch release.",
    actionOptions: ["resolve", "escalate", "hold"],
    timeline: [
      { id: "ex2-1", label: "Weight mismatch detected", timeLabel: "15m ago" },
      { id: "ex2-2", label: "Dispatch lead alerted", timeLabel: "11m ago" },
    ],
  },
  "EX-4103": {
    ...HUB_EXCEPTION_LIST.exceptions[2],
    description: "Origin certificate is missing and buyer view stays hidden until upload.",
    sourceLabel: "Inbound document desk",
    nextActionLabel: "Upload certificate or escalate to document control.",
    actionOptions: ["resolve", "escalate", "hold"],
    timeline: [
      { id: "ex3-1", label: "Missing file detected", timeLabel: "1h ago" },
      { id: "ex3-2", label: "Waiting review started", timeLabel: "48m ago" },
    ],
  },
  "EX-4104": {
    ...HUB_EXCEPTION_LIST.exceptions[3],
    description: "Route briefing completed and the reminder was cleared.",
    sourceLabel: "Hub command desk",
    nextActionLabel: "No further action required.",
    actionOptions: ["resolve"],
    timeline: [
      { id: "ex4-1", label: "Reminder created", timeLabel: "2h ago" },
      { id: "ex4-2", label: "Reminder closed", timeLabel: "1h ago" },
    ],
  },
};
