import React from "react";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

import ExplanationCurrant from "tutorial/currantExplanation";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: "space-between",
  },
  contentContainer: {
    padding: "64px 8px",
    textAlign: "center",
  },
  content: {
    maxWidth: "950px",
    margin: "8px auto",
  },
}));

const Tuto = () => {
  const classes = useStyles();

  return (
    // TODO : Proper listen key event
    <div>
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Link component={RouterLink} to="/home" color="inherit">
            <Typography variant="h6" noWrap>
              Physic Schem
            </Typography>
          </Link>
        </Toolbar>
      </AppBar>
      <div className={classes.contentContainer}>
        <div className={classes.content}>
          <ExplanationCurrant />
        </div>
      </div>
    </div>
  );
};

export default Tuto;
