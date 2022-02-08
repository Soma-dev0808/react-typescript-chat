import React from "react";
import { render, fireEvent } from "@testing-library/react";
import SignIn from "../../components/Auth/SignIn";
import createWrapper from "../utils/createWrapper";
import { handleSubmit } from "../../components/Auth/service/service";
import { getAuthFormValue } from "../utils/utilities";
import { en } from "../../utils/language";

const { wrapper, history, mockValues } = createWrapper();

jest.mock("../../components/Auth/service/service");

describe("SignIn component render test", () => {
  test("render test", async () => {
    mockValues.apiErrorStatus.isApiLoading = true;
    const { getAllByText, getByText, container } = render(<SignIn />, {
      wrapper,
    });

    expect(getAllByText(en.SIGN_IN).length).toBe(2);
    expect(getByText(en.SIGN_UP_LINK)).toBeInTheDocument();
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(1);
  });

  test("submit form test", async () => {
    mockValues.apiErrorStatus.isApiLoading = false;
    const { container } = render(<SignIn history={history} />, {
      wrapper,
    });

    // check loading indicator is rendered
    expect(
      container.getElementsByClassName("loading-indicator-container").length
    ).toBe(0);

    // get form element and trigger submit event
    const authForm = container.getElementsByClassName("auth-inner-container");
    const formValue = getAuthFormValue(true);
    fireEvent.submit(authForm[0], formValue);

    // check handleSubmit was called with expected value
    expect(handleSubmit).toBeCalledWith(
      {
        email: formValue.target.email.value,
        password: formValue.target.password.value,
      },
      mockValues.startOrEndCallApi,
      mockValues.setAPIError,
      history,
      false
    );
  });
});
