import { fireEvent, render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import SellerPayoutsPage, { SellerPayoutsView } from "./page";

describe("seller payouts page", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the payout summary and row detail in English", () => {
    render(<SellerPayoutsView locale="en" />);

    expect(screen.getByRole("heading", { name: "Payouts & settlements" })).toBeInTheDocument();
    expect(screen.getAllByText("Pending settlement").length).toBeGreaterThan(0);
    expect(screen.getAllByText("TR-10492").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Settled").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "Recent activity" })).toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: /TR-10488/i })[0]);

    expect(screen.getByRole("heading", { name: "TR-10488" })).toBeInTheDocument();
    expect(screen.getAllByText("bKash (MFS)").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Processing").length).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<SellerPayoutsPage />);

    expect(screen.getByRole("heading", { name: "পেআউট ও নিষ্পত্তি" })).toBeInTheDocument();
    expect(screen.getAllByText("বকেয়া নিষ্পত্তি").length).toBeGreaterThan(0);
    expect(screen.getByRole("heading", { name: "সাম্প্রতিক লেনদেন" })).toBeInTheDocument();
  });

  it("shows a not-found state when no payout row is selected", () => {
    render(<SellerPayoutsView locale="en" rows={[]} initialSelectedId="missing" />);

    expect(screen.getByText("No payout rows yet")).toBeInTheDocument();
    expect(screen.getByText("When payouts arrive, they will appear here with status and amount.")).toBeInTheDocument();
  });
});
