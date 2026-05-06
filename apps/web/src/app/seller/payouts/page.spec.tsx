import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerPayoutsPage, { SellerPayoutsView } from "./page";
import { apiFetch } from "../../../lib/api-client";

jest.mock("../../../lib/api-client", () => ({
  apiFetch: jest.fn(),
}));

const payoutResponse = {
  summary: {
    pending: 8920,
    completed: 12450,
    total: 21370,
    nextDisbursementAmount: 8920,
    nextDisbursementDate: "2026-11-05",
  },
  featuredDetailId: "line-1",
  records: [
    {
      id: "line-1",
      referenceCode: "TR-FH-8492-line1",
      orderRef: "FH-8492",
      method: "manual",
      status: "settled",
      amount: 12450,
      createdAt: "2026-10-28T00:00:00.000Z",
      periodLabel: "28 Oct 2026",
    },
    {
      id: "line-2",
      referenceCode: "TR-FH-8485-line2",
      orderRef: "FH-8485",
      method: "bKash",
      status: "processing",
      amount: 8920,
      createdAt: "2026-10-27T00:00:00.000Z",
      periodLabel: "27 Oct 2026",
    },
  ],
} as const;

const mockedApiFetch = apiFetch as jest.MockedFunction<typeof apiFetch>;

describe("seller payouts page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedApiFetch.mockResolvedValue(payoutResponse);
  });

  it("renders the payout summary and row detail in English", async () => {
    render(<SellerPayoutsView locale="en" />);

    expect(screen.getByRole("heading", { name: "Payouts & settlements" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText("TR-FH-8492-line1").length).toBeGreaterThan(0));
    expect(screen.getAllByText("Settled").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Recent activity" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /TR-FH-8485-line2/i })[0]);

    expect(screen.getByRole("heading", { name: "TR-FH-8485-line2" })).toBeInTheDocument();
    expect(screen.getAllByText("bKash").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage", async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<SellerPayoutsPage />);

    expect(screen.getByRole("heading", { name: "পেআউট ও নিষ্পত্তি" })).toBeInTheDocument();
    await waitFor(() => expect(screen.getAllByText("TR-FH-8492-line1").length).toBeGreaterThan(0));
    expect(screen.getByRole("heading", { name: "সাম্প্রতিক লেনদেন" })).toBeInTheDocument();
  });

  it("shows an empty state when the API returns no payout rows", async () => {
    mockedApiFetch.mockResolvedValue({ ...payoutResponse, records: [], featuredDetailId: "" });
    render(<SellerPayoutsView locale="en" initialSelectedId="missing" />);

    await waitFor(() => expect(screen.getByText("No payout rows yet")).toBeInTheDocument());
    expect(screen.getByText("When payouts arrive, they will appear here with status and amount.")).toBeInTheDocument();
  });
});
