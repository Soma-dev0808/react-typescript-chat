import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SignUp from "../../components/Auth/SignUp";
import createWrapper from "../utils/createWrapper";
import { handleSubmit } from "../../components/Auth/service/service";
import { getAuthFormValue } from "../utils/utilities";
import { en } from "../../utils/language";

const { wrapper, history, mockValues } = createWrapper();

jest.mock("../../components/Auth/service/service");

describe("SignUp component render test", () => {
  test("render test", async () => {
    mockValues.apiErrorStatus.isApiLoading = true;
    const { getAllByText, getByText, container } = render(<SignUp />, {
      wrapper,
    });

    expect(getAllByText(en.SIGN_UP).length).toBe(2);
    expect(getByText(en.SIGN_IN_LINK)).toBeInTheDocument();
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(1);
  });

  test("submit form test", async () => {
    mockValues.apiErrorStatus.isApiLoading = false;
    const { container } = render(<SignUp history={history} />, {
      wrapper,
    });

    // check render
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(0);

    // get form element and trigger submit event
    const authForm = container.getElementsByClassName("auth-inner-container");
    const formValue = getAuthFormValue(false);
    fireEvent.submit(authForm[0], formValue);

    // check handleSubmit was called with expected value
    expect(handleSubmit).toBeCalledWith(
      {
        email: formValue.target.email.value,
        password: formValue.target.password.value,
        username: formValue.target.username.value,
      },
      mockValues.startOrEndCallApi,
      mockValues.setAPIError,
      history
    );
  });
});
