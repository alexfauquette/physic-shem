import React from "react";

import { useTranslation } from "react-i18next";

import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: "space-between",
  },
  content: {
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    display: "inline-block",
    width: "100%",
    backgroundColor: "#daeeff",

    "& h2": {
      fontSize: "1.5rem",
      margin: "0",
    },
    "& p": {
      fontSize: "1.5rem",
      margin: "0.5rem 1rem 1.5rem 1rem",
      textAlign: "justify",
    },
  },
  header: {
    padding: `${theme.spacing(8)}px 0`,
    display: "inline-block",
    width: "100%",
    textAlign: "center",
  },
  headerTitle: {
    margin: "3em 1em 2em 1em",
    fontSize: "1.5rem",
  },

  callToActionContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    flex: "1 1 200px",
    "& a": {
      minWidth: "10rem",
      margin: "1rem",
    },
  },
}));

const Home = () => {
  const classes = useStyles();
  const { t, ready } = useTranslation();

  return (
    <div tabIndex="0">
      <CssBaseline />

      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <Typography variant="h6" noWrap>
            Physic Schem
          </Typography>
        </Toolbar>
      </AppBar>
      <div className={classes.header}>
        <div className={classes.headerTitle}>
          <h1>
            <span style={{ fontSize: "2rem" }}>Physic Schem</span>
            {ready ? t("title") : ", votre générateur de schéma"}
          </h1>
        </div>
        <div className={classes.callToActionContainer}>
          <Button
            component={RouterLink}
            to="/"
            variant="contained"
            color="primary"
            size="large"
          >
            {ready ? t("button.generator") : "Générateur"}
          </Button>
          <Button
            component={RouterLink}
            to="/tutorial"
            variant="contained"
            color="primary"
            size="large"
          >
            {ready ? t("button.tutorial") : "Tuto"}
          </Button>
        </div>
      </div>
      <div className={classes.content}>
        <h2>{ready ? t("paragraph1.title") : "Des schémas beau facilement"}</h2>
        <p>
          {ready
            ? t("paragraph1.txt")
            : "Avec quoi faite vous vos schémas ? Paint ou Word ? Dans les deux cas, tu dois souffrir, et le résultat ne peut qu'être décevant face à tous les efforts mis en oeuvre. Ici tu pourras faire tes schémas rapidement en ne te concentrant que sur le contenue de ton schéma. Une fois fini exporte le en png pour ou en svg (fonctionnalité à venir). Ou mieux encore récupère le code LaTeX associé."}
        </p>
        <h2>{ready ? t("paragraph2.title") : "Du code LaTeX ?"}</h2>
        <p>
          {ready ? (
            <>
              {t("paragraph2.txt.1")}
              <a href={t("paragraph2.txt.url")}>Wikibook</a>
              {t("paragraph2.txt.2")}
            </>
          ) : (
            <>
              Tu as déjà vue un cours de science que tu trouves magnifique ?
              Probablement qu'il était écrit en LaTeX. Si tu veux toi aussi
              créer de magnifiques documents, je te recommande ce{" "}
              <a href="https://fr.wikibooks.org/wiki/LaTeX/G%C3%A9n%C3%A9ralit%C3%A9s">
                Wikibook
              </a>{" "}
              qui te donnera toutes les bases.
            </>
          )}
        </p>
        <h2></h2>
        <p></p>
      </div>
    </div>
  );
};

export default Home;
