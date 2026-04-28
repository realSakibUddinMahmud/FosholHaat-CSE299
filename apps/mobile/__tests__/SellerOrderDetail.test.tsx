import React from "react";
import { render, screen } from "@testing-library/react-native";
import { SellerOrderDetailScreen } from "../src/app/seller/orders/[orderId]";

describe("seller order detail mobile lane", () => {
  it("renders the detail view", () => {
    render(<SellerOrderDetailScreen locale="en" orderId="SO-2001" />);

    expect(screen.getByText("Amina Traders")).toBeTruthy();
    expect(screen.getByText("Buyer confirmed payment method.")).toBeTruthy();
  });
});
