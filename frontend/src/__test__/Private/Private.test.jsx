import React from "react";
import { render } from "@testing-library/react";
import Private from "../../router/Private";
import createWrapper from "../utils/createWrapper";
import useAuth from "../../common_components/CustomHooks/useAuth";
import { routePath } from "../../router/router";

jest.mock("../../common_components/CustomHooks/useAuth");

const { wrapper, history } = createWrapper();

describe("Private component render test", () => {
  test("render test", () => {
    // render loading component(show loading)
    useAuth.mockReturnValueOnce({
      isAuth: false,
      isLoading: true,
    });
    const { container, rerender, getByTestId } = render(<Private />, {
      wrapper,
    });
    const loadingClass = "loading-indicator-container";
    expect(container.getElementsByClassName(loadingClass).length).toBe(1);

    // render loading component(hide loading)
    useAuth.mockReturnValueOnce({
      isAuth: false,
      isLoading: false,
    });
    rerender(<Private />, { wrapper });
    expect(container.getElementsByClassName(loadingClass).length).toBe(0);

    // render dummy component on authenticated user
    const testId = "dummy-component";
    const dummyComponent = () => <div data-testid={testId}>Dummy</div>;
    useAuth.mockReturnValueOnce({
      isAuth: true,
      isLoading: false,
    });
    const props = {
      Component: dummyComponent,
    };
    rerender(<Private {...props} />, { wrapper });
    expect(getByTestId(testId)).toBeInTheDocument();

    // render Redirect component on non-authenticated user
    useAuth.mockReturnValueOnce({
      isAuth: false,
      isLoading: false,
    });
    rerender(<Private />, { wrapper });
    expect(history.location.pathname).toBe(routePath.signIn);
  });
});
