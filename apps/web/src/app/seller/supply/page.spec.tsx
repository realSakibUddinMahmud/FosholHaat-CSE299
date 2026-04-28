import { fireEvent, render, screen } from "@testing-library/react";
import { SellerSupplyListView } from "./supply-view";
import { SellerNewSupplyView } from "./new/page";
import { SellerDwrDetailView } from "../dwr/[recordId]/page";

describe("seller supply web lane", () => {
  it("renders the seller workspace supply cards", () => {
    render(<SellerSupplyListView locale="en" mode="workspace" />);

    expect(screen.getByRole("heading", { name: "Supply workspace" })).toBeInTheDocument();
    expect(screen.getByText(/Cold store grade A/)).toBeInTheDocument();
    expect(screen.getAllByText("View DWR").length).toBeGreaterThan(0);
  });

  it("shows validation errors on an invalid new supply submit", () => {
    render(<SellerNewSupplyView locale="en" />);

    fireEvent.click(screen.getByRole("button", { name: "Save supply" }));

    expect(screen.getByLabelText("validation errors")).toBeInTheDocument();
    expect(screen.getByText("Add a short grade label.")).toBeInTheDocument();
    expect(screen.getByText("Enter a quantity above zero.")).toBeInTheDocument();
  });

  it("shows a not-found state for an unknown dwr record", () => {
    render(<SellerDwrDetailView locale="en" recordId="missing" />);

    expect(screen.getByRole("heading", { name: "Record not found" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Supply list" })).toHaveAttribute("href", "/seller/supply");
  });
});
