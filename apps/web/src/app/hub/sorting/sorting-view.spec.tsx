import { render, screen } from "@testing-library/react";
import { HubSortingView } from "./sorting-view";

describe("hub sorting web lane", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("renders the queue chrome and detail rail in English", () => {
    render(<HubSortingView locale="en" />);

    expect(screen.getByRole("heading", { name: "Sorting batch queue" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "SB-9102" })).toBeInTheDocument();
    expect(screen.getAllByText("Onion").length).toBeGreaterThan(0);
    expect(screen.getAllByText("In progress").length).toBeGreaterThan(0);
  });

  it("renders Bangla copy", () => {
    render(<HubSortingView locale="bn" />);

    expect(screen.getByRole("heading", { name: "সোর্টিং ব্যাচ কিউ" })).toBeInTheDocument();
    expect(screen.getAllByText("সক্রিয় সোর্টিং").length).toBeGreaterThan(0);
  });

  it("shows the not-found state for an unknown batch", () => {
    render(<HubSortingView locale="en" selectedId="missing" />);

    expect(screen.getByText("Batch not found")).toBeInTheDocument();
    expect(
      screen.getByText("This sorting batch is no longer available. Return to the queue.")
    ).toBeInTheDocument();
  });
});
