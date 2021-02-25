import React, { useEffect } from "react";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";

import GitHubIcon from "@material-ui/icons/GitHub";

import { getProject } from "redux/apiInteractions";
import { connect } from "react-redux";
import CircuitCard from "atoms/CircuitCard";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: "space-between",
  },
  content: {
    marginTop: "64px",
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    display: "inline-block",
    width: "100%",
    backgroundColor: "#daeeff",
  },
  cardGroup: {
    margin: "0 auto",
    display: "grid",
    gridGap: "1rem",
    maxWidth: "1200px",
    "@media (min-width: 600px)": {
      gridTemplateColumns: "repeat(2, 1fr)",
    },
    "@media (min-width: 900px)": {
      gridTemplateColumns: "repeat(3, 1fr)",
    },
    "@media (min-width: 1200px)": {
      gridTemplateColumns: "repeat(4, 1fr)",
    },
  },
}));

const mapStateToProps = (state) => {
  return { projects: state.projects || [] };
};
const mapDispatchToProps = (dispatch) => {
  return {
    getProject: (id) => dispatch(getProject(id)),
  };
};

const Catalogue = ({ projects, getProject }) => {
  const classes = useStyles();

  useEffect(() => {
    getProject();
  }, []);

  return (
    <div tabIndex="0">
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Link component={RouterLink} to="/home" color="inherit">
            <Typography variant="h6" noWrap>
              Physic Schem
            </Typography>
          </Link>
          <IconButton
            component="a"
            href={"https://github.com/alexfauquette/physic-shem"}
          >
            <GitHubIcon style={{ color: "white" }} fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.content}>
        <div className={classes.cardGroup}>
          <CircuitCard />
        </div>

        <div className={classes.cardGroup}>
          {projects.map(({ id, username, circuitname, date }) => (
            <CircuitCard
              key={id}
              id={id}
              username={username}
              circuitname={circuitname}
              date={date}
              onClick={() => getProject(id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Catalogue);
