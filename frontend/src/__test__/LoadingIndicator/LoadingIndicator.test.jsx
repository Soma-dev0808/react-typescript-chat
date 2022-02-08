import React from "react";
import { render, cleanup } from "@testing-library/react";
import LoadingIndicator from "../../common_components/LoadingIndicator/LoadingIndicator";

afterEach(cleanup);

describe("Laoding indicator test", () => {
  test("render test", () => {
    const { container, rerender } = render(<LoadingIndicator />);

    expect(container.firstChild).toBe(null);

    rerender(<LoadingIndicator isLoading />);
    expect(container.firstChild).toHaveClass("loading-indicator-container");
  });
});
