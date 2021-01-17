import React from "react";
import classes from "./index.module.scss";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import ExplanationCurrant from "tutorial/currantExplanation";

const Tuto = () => (
  // TODO : Proper listen key event
  <div>
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

export default Tuto;
