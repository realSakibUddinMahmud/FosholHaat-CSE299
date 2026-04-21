import React from "react";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { HubWorkspaceScreen } from "../src/app/hub/index";

describe("hub workspace mobile shell", () => {
  it("opens the coordination workspace", () => {
    const onOpenWorkspace = jest.fn();

    render(<HubWorkspaceScreen locale="en" onOpenWorkspace={onOpenWorkspace} />);

    expect(screen.getByText("Hub coordination")).toBeTruthy();

    fireEvent.press(screen.getByRole("button", { name: "Open coordination workspace" }));

    expect(onOpenWorkspace).toHaveBeenCalled();
  });
});
