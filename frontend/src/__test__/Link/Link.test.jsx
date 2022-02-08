import React from "react";
import { render, cleanup } from "@testing-library/react";
import StyledLink from "../../common_components/Link/StyledLink";
import createWrapper from "../utils/createWrapper";

const { wrapper } = createWrapper();

describe("Link render test", () => {
  test("render test", async () => {
    const linkTitle = "styled link test";
    const { findByText, rerender } = render(
      <StyledLink to={"/"} title={linkTitle} disabled />,
      {
        wrapper,
      }
    );

    const renderedLink = await findByText(linkTitle);

    expect(renderedLink).toBeInTheDocument();
    expect(renderedLink).toHaveClass("styled-link");
    expect(renderedLink).toHaveClass("disable-link");

    rerender(<StyledLink to={"/"} title={linkTitle} disabled={false} />, {
      wrapper,
    });

    expect(renderedLink).not.toHaveClass("disable-link");
  });
});
