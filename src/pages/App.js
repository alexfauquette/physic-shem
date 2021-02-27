import React, { useEffect, useState, useRef } from "react";
import { connect } from "react-redux";

import { Link as RouterLink, useParams } from "react-router-dom";
import Link from "@material-ui/core/Link";

import {
  MODE_DRAG,
  MODE_SELECT,
  MODE_MOVE_PAPER,
} from "redux/store/interactionModes";

import RoughDrawing from "container/RoughDrawing";
import Container from "container/index.js";
import LatexDisplay from "container/latexDisplay";
import ElementOptions from "container/elementOptions";
import LeftMenu from "container/leftMenu";
import Tutorial from "container/tutorial";
import FileManager from "container/FileManager";

import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";

import PhotoLibraryIcon from "@material-ui/icons/PhotoLibrary";

import {
  startSelect,
  splitAnchor,
  stackSelectedAnchors,
  deleteElement,
  movePaper,
  endMovePaper,
} from "redux/actions";
import { getProject } from "redux/apiInteractions";

const drawerWidth = 180;
const optionDrawerWidth = 280;

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
  optionDrawer: {},
  optionDrawerPaper: { width: optionDrawerWidth },
  content: {
    flexGrow: 1,
    padding: `${theme.spacing(8)} 0`,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },

  keyboardKey: {
    backgroundColor: "#eee",
    borderRadius: "3px",
    border: "1px solid #b4b4b4",
    boxShadow:
      "0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset",
    color: "#333",
    display: "inline-block",
    fontSize: "1.2em",
    fontWeight: 600,
    lineHeight: 1,
    padding: "8px 8px",
  },
  keyboardDescription: {
    fontSize: "1.1rem",
  },
}));

const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    selection: state.selection,
    isPaperDragged: state.displayOptions.dragging.isDragging,
    currentProject: state.currentProject,
  };
};
const mapDispatchToProps = (dispatch) => {
  return {
    startSelect: () => dispatch(startSelect()),
    splitAnchor: () => dispatch(splitAnchor()),
    stackSelectedAnchors: (direction) =>
      dispatch(stackSelectedAnchors(direction)),
    deleteElement: (selection) => {
      dispatch(deleteElement(selection));
    },
    movePaper: (x, y) => dispatch(movePaper(x, y)),
    endMovePaper: () => dispatch(endMovePaper()),
    getProject: (id) => dispatch(getProject(id)),
  };
};

function App({
  mode,
  selection,
  isPaperDragged,
  currentProject,
  startSelect,
  splitAnchor,
  stackSelectedAnchors,
  deleteElement,
  movePaper,
  endMovePaper,
  getProject,
}) {
  const classes = useStyles();

  const [showCode, setShowCode] = useState(false);
  const [showRough, setShowRough] = useState(false);

  const openRough = () => setShowRough(true);
  const openCode = () => setShowCode(true);

  const closeRough = () => setShowRough(false);
  const closeCode = () => setShowCode(false);

  const svgRef = useRef();

  const { schemId } = useParams();
  useEffect(() => {
    // load the project when the url param does not match anymore
    if (`${currentProject.id}` !== schemId) {
      getProject(schemId);
    }
  }, [schemId, currentProject.id]);

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
        case "Delete":
          deleteElement(selection);
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
  }, [splitAnchor, stackSelectedAnchors, deleteElement, selection]);

  const mouseMove = (event) => {
    movePaper(event.nativeEvent.clientX, event.nativeEvent.clientY);
  };
  return (
    // TODO : Proper listen key event
    <div
      className={classes.root}
      tabIndex="0"
      onMouseDown={startSelect}
      onMouseMove={
        mode === MODE_MOVE_PAPER && isPaperDragged ? mouseMove : null
      }
      onMouseUp={
        mode === MODE_MOVE_PAPER && isPaperDragged ? endMovePaper : null
      }
    >
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Link component={RouterLink} to="/home" color="inherit">
            <Typography variant="h6" noWrap>
              Physic Schem
            </Typography>
          </Link>

          <div>
            <Tutorial classes={classes} />
            <FileManager
              edge="start"
              className={classes.menuButton}
              color="inherit"
            />
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="open rough drawer"
              onClick={openRough}
            >
              <PhotoLibraryIcon />
            </IconButton>
            <Button color="inherit" variant="outlined" onClick={openCode}>
              LaTEX
            </Button>
          </div>
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
          <LeftMenu />
        </div>
      </Drawer>
      <Drawer
        anchor="right"
        variant="persistent"
        open={
          (mode === MODE_SELECT || mode === MODE_DRAG) && selection.length === 1
        }
        className={classes.optionDrawer}
        classes={{
          paper: classes.optionDrawerPaper,
        }}
        // catch mousedown in element options
        onMouseDown={(event) => event.stopPropagation()}
      >
        <Toolbar />
        <ElementOptions />
      </Drawer>
      <main className={classes.content}>
        <Container ref={svgRef} />
      </main>

      <Dialog open={showCode} onClose={closeCode}>
        <LatexDisplay />
      </Dialog>
      <Dialog maxWidth="lg" open={showRough} onClose={closeRough}>
        <RoughDrawing />
      </Dialog>
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
