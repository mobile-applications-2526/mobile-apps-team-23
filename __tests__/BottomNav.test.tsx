import React from "react";
import { render } from "@testing-library/react-native";
import BottomNav from "@/components/BottomNav";

jest.mock("expo-router", () => ({
  usePathname: () => "/home",
  useRouter: () => ({ push: jest.fn() }),
}));

describe("BottomNav", () => {
  it("renders all main tabs", () => {
    const { getByText } = render(<BottomNav />);

    expect(!!getByText("Home")).toBe(true);
    expect(!!getByText("Map")).toBe(true);
    expect(!!getByText("Berichten")).toBe(true);
    expect(!!getByText("Account")).toBe(true);
  });
});
