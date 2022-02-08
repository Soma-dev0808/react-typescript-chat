import React from "react";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import Header from "../../common_components/Header/Header";
import createWrapper from "../utils/createWrapper";
import { flushPromises } from "../utils/utilities";
import useAuth from "../../common_components/CustomHooks/useAuth";
import { signOut } from "../../components/Auth/service/service";

import { routePath } from "../../router/router";
import { en } from "../../utils/language";

afterEach(cleanup);

jest.mock("../../common_components/CustomHooks/useAuth");
jest.mock("../../components/Auth/service/service");

const mockUseLocationValue = {
  pathname: "/",
  search: "",
  hash: "",
  state: null,
};

const mockHistoryPush = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useLocation: () => mockUseLocationValue,
  useHistory: () => ({
    push: mockHistoryPush,
  }),
}));
const { wrapper, mockValues } = createWrapper();

describe("Header component test", () => {
  test("render test", async () => {
    useAuth.mockReturnValue({ isLoading: false, isAuth: false });
    // Wrapper with react-router and context
    render(<Header />, { wrapper });

    const headerTitleElement = await screen.findByRole("heading");
    expect(headerTitleElement).toBeInTheDocument();
  });

  test("Menu button text test", async () => {
    useAuth.mockReturnValue({ isLoading: false, isAuth: false });
    const { rerender, getByText } = render(<Header />, {
      wrapper,
    });
    const buttonElement = await screen.findByRole("button");
    expect(buttonElement).toBeInTheDocument();

    expect(getByText(en.SIGN_UP)).toBeDefined();

    // chnage isAuth and check if MenuButton text was changed
    useAuth.mockReturnValue({ isLoading: false, isAuth: true });

    rerender(<Header />, { wrapper });

    expect(getByText(en.LOG_OUT)).toBeDefined();

    // chnage isAuth and pathname, then check if MenuButton text was changed
    useAuth.mockReturnValue({ isLoading: false, isAuth: false });
    mockUseLocationValue.pathname = routePath.signUp;

    rerender(<Header />, { wrapper });

    expect(getByText(en.SIGN_IN)).toBeDefined();
  });

  test("Menu button click test", async () => {
    useAuth.mockReturnValue({ isLoading: false, isAuth: false });
    const { rerender } = render(<Header />, { wrapper });

    const buttonElement = await screen.findByRole("button");
    expect(buttonElement).toBeInTheDocument();

    // click handleButtonClick function without authentication on location sign-up
    fireEvent.click(buttonElement);
    expect(mockHistoryPush).toHaveBeenCalledWith(routePath.signIn);

    mockUseLocationValue.pathname = routePath.signIn;

    // click handleButtonClick function without authentication on location sign-in
    fireEvent.click(buttonElement);
    expect(mockHistoryPush).toHaveBeenCalledWith(routePath.signUp);

    useAuth.mockReturnValue({ isLoading: false, isAuth: true });
    signOut.mockReturnValue({});
    rerender(<Header />, { wrapper });

    fireEvent.click(buttonElement);

    expect(mockValues.startOrEndCallApi).toHaveBeenCalled();
    expect(signOut).toHaveBeenCalled();

    await flushPromises();

    expect(mockValues.startOrEndCallApi).toHaveBeenCalledWith(false);

    signOut.mockReturnValue({ errorMessage: "error" });

    fireEvent.click(buttonElement);

    await flushPromises();

    expect(mockValues.setAPIError).toHaveBeenCalledWith("error");
  });
});
