import { render, screen } from "@testing-library/react";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import HubWorkspacePage, { HubWorkspaceView } from "./page";

describe("hub coordination web shell", () => {
  it("renders the desktop command board", () => {
    render(<HubWorkspaceView locale="en" />);

    expect(screen.getByRole("heading", { name: "Hub coordination", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Inbound/i })).toHaveAttribute("href", "/hub/inbound");
    expect(screen.getByRole("link", { name: /Dispatch/i })).toHaveAttribute("href", "/hub/dispatch");
    expect(screen.getByText("Active alerts")).toBeInTheDocument();
  });

  it("reads locale from the page entrypoint", () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");

    render(<HubWorkspacePage />);

    expect(screen.getByRole("heading", { name: "Hub coordination", level: 1 })).toBeInTheDocument();
  });
});
