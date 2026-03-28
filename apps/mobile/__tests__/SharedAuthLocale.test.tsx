import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LOCALE_STORAGE_KEY } from "@fosholhaat/types";
import LoginScreen from "../src/app/login/index";
import SignupRoleScreen from "../src/app/signup/role/index";

describe("Shared auth locale behavior on mobile", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    global.fetch = jest.fn();
    await AsyncStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it("renders Bangla login copy when Bangla is stored", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");

    render(<LoginScreen />);

    await waitFor(() => {
      expect(screen.getByText("আপনার অ্যাকাউন্টে ঢুকুন")).toBeTruthy();
      expect(screen.getByText("ফোন বা ইমেইল")).toBeTruthy();
      expect(screen.getByText("লগইন")).toBeTruthy();
    });
  });

  it("passes the stored locale into role selection", async () => {
    await AsyncStorage.setItem(LOCALE_STORAGE_KEY, "bn");
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ nextRoute: "/signup/seller" }),
    });

    render(<SignupRoleScreen />);

    await waitFor(() => {
      expect(screen.getByText("আপনি কোন কাজ করেন?")).toBeTruthy();
    });

    fireEvent.press(screen.getByText("বিক্রেতা"));
    fireEvent.press(screen.getByText("এগিয়ে যান"));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/auth/role-selection"),
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({ role: "seller", locale: "bn" }),
        }),
      );
    });
  });
});
