import React, { useEffect } from "react";
import Container from "./container/index.js";
import { connect } from "react-redux";
import { MODE_SELECT } from "./redux/store";
import components, { isPath } from "./components";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  startSelect,
  startCreateAnchor,
  startCreatePathElement,
  startCreateNodeElement,
  splitAnchor,
  stackSelectedAnchors,
} from "./redux/actions/index.js";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
}));

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    selection: state.selection,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    startSelect: () => dispatch(startSelect()),
    startCreateAnchor: () => dispatch(startCreateAnchor()),
    startCreatePathElement: (elementType) =>
      dispatch(startCreatePathElement(elementType)),
    startCreateNodeElement: (elementType) =>
      dispatch(startCreateNodeElement(elementType)),
    splitAnchor: () => dispatch(splitAnchor()),
    stackSelectedAnchors: (direction) =>
      dispatch(stackSelectedAnchors(direction)),
  };
};

function App({
  mode,
  selection,
  startSelect,
  startCreateAnchor,
  startCreatePathElement,
  startCreateNodeElement,
  splitAnchor,
  stackSelectedAnchors,
}) {
  const classes = useStyles();

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowRight":
          stackSelectedAnchors("R");
          break;
        case "ArrowLeft":
          stackSelectedAnchors("L");
          break;
        case "ArrowUp":
          stackSelectedAnchors("U");
          break;
        case "ArrowDown":
          stackSelectedAnchors("D");
          break;
        case "s":
          splitAnchor();
          break;
        default:
          console.log(event.key);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [splitAnchor, stackSelectedAnchors]);

  return (
    // TODO : Proper listen key event
    <div className={classes.root} tabIndex="0" onMouseDown={startSelect}>
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            Clipped drawer
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            {Object.keys(components).map((name) => (
              <ListItem
                button
                key={name}
                onMouseDown={(event) => {
                  event.stopPropagation();
                  if (isPath[name]) {
                    startCreatePathElement(name);
                  } else {
                    startCreateNodeElement(name);
                  }
                }}
              >
                <ListItemText primary={name} />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 100 50"
                  style={{ width: 100, height: 50 }}
                >
                  {components[name]({ x: 50, y: 25 })}
                </svg>
              </ListItem>
            ))}
            <button onClick={startCreateAnchor}>Anchor</button>
          </List>
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        variant="persistent"
        open={mode === MODE_SELECT && selection.length === 1}
      >
        <Toolbar />
        <p>kjdxhfks</p>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Container />
      </main>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
