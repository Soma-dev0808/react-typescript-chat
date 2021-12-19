import React from "react";

import { CurrUsers } from "../Chat";
import { en } from "../../../utils/language";
import onlineIcon from "../../../icons/onlineIcon.png";

import "./TextContainer.scss";

interface TextContainerProps {
  users: CurrUsers[];
}

const TextContainer: React.FC<TextContainerProps> = ({ users }) => (
  <div className="textContainer">
    {users ? (
      <div>
        <h1>{en.CURR_CHATTING_USERS}</h1>
        <div className="activeContainer">
          <h2>
            {users.map(({ name, id }) => (
              <div key={name + id} className="activeItem">
                {name}
                <img alt="Online Icon" src={onlineIcon} />
              </div>
            ))}
          </h2>
        </div>
      </div>
    ) : null}
  </div>
);

export default TextContainer;
