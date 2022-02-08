import React from "react";
import { render, cleanup } from "@testing-library/react";
import createWrapper from "../utils/createWrapper";
import { getErrorMessages } from "../utils/utilities";
import ApiResponseBar from "../../common_components/Header/ApiResponseBar/ApiResponseBar";

afterEach(cleanup);
const { wrapper, mockValues } = createWrapper();

describe("ApiResponseBar test", () => {
  test("error messages render test", async () => {
    let errorMessages = getErrorMessages();
    mockValues.apiErrorStatus.apiErrorMessage = errorMessages[0];
    const { getByText, findAllByRole, rerender } = render(<ApiResponseBar />, {
      wrapper,
    });

    expect(getByText(errorMessages[0])).toBeInTheDocument();

    errorMessages = getErrorMessages(3);
    mockValues.apiErrorStatus.apiErrorMessage = errorMessages;
    rerender(<ApiResponseBar />, { wrapper });

    expect(getByText(errorMessages[0])).toBeInTheDocument();
    expect(getByText(errorMessages[1])).toBeInTheDocument();
    expect(getByText(errorMessages[2])).toBeInTheDocument();

    const listItems = await findAllByRole("listitem");

    expect(listItems).toHaveLength(3);
  });
});
