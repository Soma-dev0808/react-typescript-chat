import React from "react";
import { Router as ReactRouter, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import Header from "./common_components/Header";

import routes, { routePath } from "./router/router";
import { SignIn } from "./page_components/Auth";
import { SignUp } from "./page_components/Auth";
import Private from "./page_components/Private";

import "./App.scss";
import useSetMobileScreenHight from "./common_components/CustomHooks/useSetMobileScreenHight";

const App: React.FC = () => {
  const history = createBrowserHistory();
  // adjust hight form mobile screen.
  useSetMobileScreenHight();
  return (
    <ReactRouter history={history}>
      <Header />
      <Switch>
        <Route path={routePath.signIn} exact component={SignIn} />
        <Route path={routePath.signUp} exact component={SignUp} />

        {routes.map((route, i) => {
          return <Private key={i} {...route} />;
        })}
      </Switch>
    </ReactRouter>
  );
};

export default App;
