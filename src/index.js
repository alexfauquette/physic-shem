import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "redux/store";

import "./index.css";
import App from "pages/App";
import Home from "pages/Home";
import Tuto from "pages/Tuto";
import * as serviceWorker from "./serviceWorker";

import { ThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
