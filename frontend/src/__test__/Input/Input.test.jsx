import React from "react";
import { render, fireEvent } from "@testing-library/react";
import Input from "../../components/Chat/Input/Input";

describe("Input component render test", () => {
  const mockHandleInput = jest.fn();
  const mockSendMessage = jest.fn();
  test("render test", () => {
    const { getAllByRole } = render(
      <Input
        message={""}
        handleInput={mockHandleInput}
        sendMessage={mockSendMessage}
      />
    );

    expect(getAllByRole("textbox")).toHaveLength(1);
    expect(getAllByRole("button")).toHaveLength(1);
  });

  test("input and submit test", () => {
    mockSendMessage.mockImplementation((e) => {
      e.preventDefault();
    });
    const { getByRole, container } = render(
      <Input
        message={""}
        handleInput={mockHandleInput}
        sendMessage={mockSendMessage}
      />
    );

    const inputField = getByRole("textbox");
    const submitButton = getByRole("button");

    // input and trigger onchange event
    inputField.onchange = mockHandleInput;
    fireEvent.change(inputField, { target: "test" });
    expect(mockHandleInput.mock.calls.length).toBe(1);

    // can't test onKeyPress test because input is covered by <form>
    fireEvent.click(submitButton);
    expect(mockSendMessage.mock.calls.length).toBe(1);
  });
});
