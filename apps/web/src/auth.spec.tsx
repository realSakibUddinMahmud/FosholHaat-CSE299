import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRouter } from "next/navigation";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import LoginPage from "./app/login/page";
import LanguagePage from "./app/language/page";
import SignupRolePage from "./app/signup/role/page";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("Shared auth locale behavior on web", () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    global.fetch = jest.fn();
    window.localStorage.clear();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    mockPush.mockClear();
  });

  it("renders Bangla login copy when Bangla is stored", async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<LoginPage />);

    expect(screen.getByLabelText("ফোন বা ইমেইল")).toBeInTheDocument();
    expect(screen.getByLabelText("পাসওয়ার্ড")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "লগইন" })).toBeInTheDocument();
  });

  it("stores locale and continues from language page", async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ locale: "en" }),
    });

    render(<LanguagePage />);

    fireEvent.click(screen.getByRole("button", { name: "English" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue" }));

    await waitFor(() => {
      expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
      expect(mockPush).toHaveBeenCalledWith("/login");
    });
  });

  it("sends the selected locale with role selection", async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ nextRoute: "/signup/seller" }),
    });

    render(<SignupRolePage />);

    fireEvent.click(screen.getByRole("button", { name: /বিক্রেতা/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        "/api/auth/role-selection",
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ role: "seller", locale: "bn" }),
        }),
      );
      expect(mockPush).toHaveBeenCalledWith("/signup/seller");
    });
  });

  it("falls back to the local signup route when role selection API is unavailable", async () => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, "en");
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error("offline"));

    render(<SignupRolePage />);

    fireEvent.click(screen.getByRole("button", { name: /buyer/i }));

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/signup/buyer");
    });
  });
});
