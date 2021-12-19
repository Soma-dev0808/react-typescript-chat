import React from "react";
import { Route, Redirect, RouteComponentProps } from "react-router-dom";

import LoadingIndicator from "../../common_components/LoadingIndicator";
import { routePath } from "../../router/router";
import useAuth from "../../common_components/CustomHooks/useAuth";

interface Props {
  Component: React.FC<RouteComponentProps>;
  path: string;
  key: number;
}

const Private: React.FC<Props> = (props) => {
  const { Component, ...rest } = props;
  const { isLoading, isAuth } = useAuth();

  if (isLoading) {
    return <LoadingIndicator isLoading />;
  }

  return isAuth ? (
    <Route exact {...rest} render={(props) => <Component {...props} />} />
  ) : (
    <Redirect to={routePath.signIn} />
  );
};

export default Private;
