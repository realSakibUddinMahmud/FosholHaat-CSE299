import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubInboundPage from "./page";
import { HubInboundView } from "./inbound-view";

describe("hub inbound web lane", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the queue and detail rail in English", () => {
    render(<HubInboundView locale="en" />);

    expect(screen.getByRole("heading", { name: "Inbound receipt queue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "IR-6201" })).toBeInTheDocument();
    expect(screen.getAllByText("Kazi Traders").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Pending").length).toBeGreaterThan(0);
  });

  it("reads Bangla copy from browser locale storage", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<HubInboundPage />);

    expect(screen.getByRole("heading", { name: "ইনবাউন্ড রিসিপ্ট কিউ" })).toBeInTheDocument();
    expect(screen.getAllByText("সক্রিয় ইনবাউন্ড").length).toBeGreaterThan(0);
  });

  it("shows the not-found state for an unknown receipt", () => {
    render(<HubInboundView locale="en" selectedId="missing" />);

    expect(screen.getByText("Receipt not found")).toBeInTheDocument();
    expect(screen.getByText("This inbound receipt is no longer available. Return to the queue.")).toBeInTheDocument();
  });
});
