import React from "react";
import { render, cleanup, fireEvent } from "@testing-library/react";
import AuthForm from "../../page_components/Auth/AuthForm/";
import createWrapper from "../utils/createWrapper";
import { en } from "../../utils/language";

afterEach(cleanup);

// const { wrapper } = createWrapper();

describe("Auth Form test", () => {
  test("render test", async () => {
    const { container, rerender, findAllByRole } = render(
      <AuthForm isLogin={false} formAction={() => {}} isLoading={false} />
    );

    expect(container.firstChild).not.toBe(null);

    let inputFields = await findAllByRole("textbox");
    expect(inputFields.length).toBe(2);

    rerender(<AuthForm isLogin formAction={() => {}} isLoading={false} />);

    inputFields = await findAllByRole("textbox");
    expect(inputFields.length).toBe(1);
  });

  test("Form action test", async () => {
    const mockFormAction = jest.fn();

    mockFormAction.mockImplementation((e) => {
      e.preventDefault();
    });

    const { getByRole, getByPlaceholderText } = render(
      <AuthForm isLogin={false} formAction={mockFormAction} isLoading={false} />
    );

    // input value
    const inputFields = getByPlaceholderText(
      en.USERNAME_PLACEHOLDER
    ) as HTMLInputElement;
    fireEvent.change(inputFields, { target: { value: "23" } });
    expect(inputFields.value).toBe("23");

    // input value
    const inputFields2 = getByPlaceholderText(
      en.USERNAME_PLACEHOLDER
    ) as HTMLInputElement;
    fireEvent.change(inputFields2, { target: { value: "235" } });
    expect(inputFields.value).toBe("235");

    fireEvent.click(getByRole("button"));

    expect(mockFormAction).toHaveBeenCalled();
  });
});
