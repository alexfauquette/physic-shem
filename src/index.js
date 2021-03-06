import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

// import i18n (needs to be bundled ;))
import "./i18n";

import "./index.css";
import App from "pages/App";
import Home from "pages/Home";
import Tuto from "pages/Tuto";
import Catalogue from "pages/Catalogue";
import Messages from "container/serverMessages";

import * as serviceWorker from "./serviceWorker";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import ReactGA from "react-ga";
ReactGA.initialize(process.env.REACT_APP_GA_ID);
ReactGA.pageview(window.location.href);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ReactGA.pageview(window.location.href);
  }, [pathname]);

  return null;
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#1565c0",
    },
    secondary: {
      main: "#42a5f5",
    },
  },
});

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Router>
          <ScrollToTop />
          <p id="load-font">aaa</p>
          <Switch>
            <Route path="/app/:schemId?">
              <App />
            </Route>
            <Route path="/catalogue">
              <Catalogue />
            </Route>
            <Route path="/tutorial">
              <Tuto />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
          <Messages />
        </Router>
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
