import React from "react";
import { routePath } from "../../../router/router";
import StyledLink from "../../../common_components/StyledLink";
import Button from "../../../common_components/Button/Button";
import { en } from "../../../utils/language";
import "../Auth.scss";

export interface UserInputProps {
  username?: string;
  email: string;
  password: string;
}

interface AuthFormProps {
  isLogin: boolean;
  formAction: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  formAction,
  isLoading,
}) => {
  const formTitle: string = isLogin ? en.SIGN_IN : en.SIGN_UP;
  const linkTitle: string = isLogin ? en.SIGN_UP_LINK : en.SIGN_IN_LINK;
  const linkAddress: string = isLogin ? routePath.signUp : routePath.signIn;
  return (
    <div className="auth-outer-container">
      <form className="auth-inner-container" onSubmit={formAction}>
        <h1 className="heading">{formTitle}</h1>
        {!isLogin && (
          <input
            placeholder={en.USERNAME_PLACEHOLDER}
            className="join-input mb-20"
            type="text"
            name="username"
            maxLength={8}
            disabled={isLoading}
          />
        )}
        <input
          placeholder={en.EMAIL_PLACEHOLDER}
          className="join-input"
          type="text"
          name="email"
          disabled={isLoading}
        />
        <input
          placeholder={en.PASSWORD_PLACEHOLDER}
          className="join-input mt-20"
          type="password"
          name="password"
          disabled={isLoading}
        />
        <Button
          classnames="mt-20"
          buttonType="submit"
          isDisabled={isLoading}
          buttonText={formTitle}
          primary
        />
        <StyledLink to={linkAddress} title={linkTitle} disabled={isLoading} />
      </form>
    </div>
  );
};

export default AuthForm;
