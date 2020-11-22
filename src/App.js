import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { MODE_SELECT } from "./redux/store";

import Container from "./container/index.js";
import LatexDisplay from "./container/latexDisplay";
import ElementOptions from "./container/elementOptions";

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

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";

import {
  startSelect,
  startCreatePathElement,
  startCreateNodeElement,
  splitAnchor,
  stackSelectedAnchors,
} from "./redux/actions";

const drawerWidth = 180;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: "space-between",
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
  startCreatePathElement,
  startCreateNodeElement,
  splitAnchor,
  stackSelectedAnchors,
}) {
  const classes = useStyles();
  const [showColde, setShowCode] = useState(false);

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
        <Toolbar className={classes.toolBar}>
          <Typography variant="h6" noWrap>
            Clipped drawer
          </Typography>

          <Button color="inherit" onClick={() => setShowCode(true)}>
            LaTEX
          </Button>
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
          </List>
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        variant="persistent"
        open={mode === MODE_SELECT && selection.length === 1}
      >
        <Toolbar />
        <ElementOptions />
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        <Container />
      </main>

      <Dialog
        open={showColde}
        onClose={() => {
          setShowCode(false);
        }}
      >
        <LatexDisplay />
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
