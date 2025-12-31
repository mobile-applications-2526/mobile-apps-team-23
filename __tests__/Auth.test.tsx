import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import Auth from "@/components/Auth";

describe("Auth component", () => {
  it("updates email and password inputs and allows pressing sign in", () => {
    const { getByTestId } = render(<Auth />);

    const emailInput = getByTestId("email");
    const passwordInput = getByTestId("password");
    const signInButton = getByTestId("login-button");

    fireEvent.changeText(emailInput, "test@example.com");
    fireEvent.changeText(passwordInput, "secret");
    fireEvent.press(signInButton);
  });
});
