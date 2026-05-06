import React from "react";
import { render, screen } from "@testing-library/react-native";
import { SellerWorkspaceScreen } from "../src/app/seller/index";

describe("seller supply mobile lane", () => {
  it("renders the supply queue", () => {
    render(<SellerWorkspaceScreen locale="en" mode="supply" />);

    expect(screen.getByText("Supply list")).toBeTruthy();
    expect(screen.getByText("Potato")).toBeTruthy();
  });
});
