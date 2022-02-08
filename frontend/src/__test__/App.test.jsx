import React from "react";
import { render, screen } from "@testing-library/react";
import App from "../App";

describe("App component render test", () => {
  test("render test", async () => {
    render(<App />);
    const headerTitleElement = await screen.findByText(/Realtime Chat App/i);
    expect(headerTitleElement).toBeInTheDocument();

    const signInPageElement = await screen.findAllByText(/Sign In/i);
    expect(signInPageElement.length).toBe(2);
  });
});
