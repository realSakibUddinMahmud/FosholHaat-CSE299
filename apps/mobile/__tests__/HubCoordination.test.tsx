import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { HubCoordinationScreen } from "../src/app/hub/coordination/index";

describe("hub coordination mobile lane", () => {
  it("renders the coordination feed and opens a downstream lane", () => {
    const onOpenLane = jest.fn();

    render(<HubCoordinationScreen locale="en" onOpenLane={onOpenLane} />);

    expect(screen.getByText("Coordination Feed")).toBeTruthy();
    expect(screen.getByText(/Lot #L-8821/)).toBeTruthy();

    fireEvent.press(screen.getByRole("button", { name: /Manage Task Lot #L-8821/ }));

    expect(onOpenLane).toHaveBeenCalledWith("sorting");
  });
});
