import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

// import i18n (needs to be bundled ;))
import "./i18n";
import i18n from "i18next";
import { I18nextProvider } from "react-i18next";

import "./index.css";
import App from "pages/App";
import Home from "pages/Home";
import Tuto from "pages/Tuto";
import * as serviceWorker from "./serviceWorker";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import {
  HashRouter as Router,
  Switch,
  Route,
  useLocation,
} from "react-router-dom";

import ReactGA from "react-ga";
ReactGA.initialize("G-JCS6D2Q6RR");
ReactGA.pageview(window.location.pathname + window.location.search);

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    ReactGA.pageview(window.location.pathname + window.location.search);
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
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Router basename={process.env.PUBLIC_URL}>
            <ScrollToTop />
            <p id="load-font">aaa</p>
            <Switch>
              <Route path="/home">
                <Home />
              </Route>
              <Route path="/tutorial">
                <Tuto />
              </Route>
              <Route path="/">
                <App />
              </Route>
            </Switch>
          </Router>
        </Provider>
      </ThemeProvider>
    </I18nextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
