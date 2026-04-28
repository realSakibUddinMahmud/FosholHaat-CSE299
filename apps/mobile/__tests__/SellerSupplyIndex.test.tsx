import React from "react";
import { render, screen } from "@testing-library/react-native";
import { SellerWorkspaceScreen } from "../src/app/seller/index";

describe("seller supply mobile lane", () => {
  it("renders the supply queue", () => {
    render(<SellerWorkspaceScreen locale="en" />);

    expect(screen.getByText("Supply workspace")).toBeTruthy();
    expect(screen.getByText("Potato")).toBeTruthy();
  });
});
