import React from "react";
import { routePath } from "../../../router/router";
import Button from "../../../common_components/Button/Button";
import FormLayout from "../../../common_components/FormLayout";

import { AuthFormProps } from "../../../utils/types";
import { en } from "../../../utils/language";

const AuthForm: React.FC<AuthFormProps> = ({
  isLogin,
  formAction,
  isLoading,
}) => {
  const formTitle: string = isLogin ? en.SIGN_IN : en.SIGN_UP;
  const linkTitle: string = isLogin ? en.SIGN_UP_LINK : en.SIGN_IN_LINK;
  const linkAddress: string = isLogin ? routePath.signUp : routePath.signIn;
  return (
    <FormLayout
      formTitle={formTitle}
      formAction={formAction}
      linkAddress={linkAddress}
      linkTitle={linkTitle}
      disabled={isLoading}
    >
      {!isLogin && (
        <input
          placeholder={en.USERNAME_PLACEHOLDER}
          className="form-input mb-20"
          type="text"
          name="username"
          maxLength={8}
          disabled={isLoading}
        />
      )}
      <input
        placeholder={en.EMAIL_PLACEHOLDER}
        className="form-input"
        type="text"
        name="email"
        disabled={isLoading}
      />
      <input
        placeholder={en.PASSWORD_PLACEHOLDER}
        className="form-input mt-20"
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
        textBold
      />
    </FormLayout>
  );
};

export default AuthForm;
