import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { SellerOrdersListScreen } from "../src/app/seller/orders/index";

describe("seller orders mobile lane", () => {
  it("renders the queue and opens an order", () => {
    const onOpenOrder = jest.fn();

    render(<SellerOrdersListScreen locale="en" onOpenOrder={onOpenOrder} />);

    expect(screen.getByText("Seller orders")).toBeTruthy();
    expect(screen.getByText("Amina Traders")).toBeTruthy();

    fireEvent.press(screen.getAllByRole("button", { name: "View order" })[0]);

    expect(onOpenOrder).toHaveBeenCalledWith("SO-2001");
  });
});
