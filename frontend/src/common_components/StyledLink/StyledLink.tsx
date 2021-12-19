import React from "react";
import { Link } from "react-router-dom";

import { classNames } from "../../utils/utilities";
import "./StyledLink.scss";

interface StyledLinkProps {
  to: string;
  title: string;
  disabled?: boolean;
}

const StyledLink: React.FC<StyledLinkProps> = ({
  to,
  title,
  disabled = false,
}) => {
  return (
    <div className="link-container">
      <Link
        className={classNames("styled-link", { "disable-link": disabled })}
        to={to}
      >
        {title}
      </Link>
    </div>
  );
};

export default StyledLink;
