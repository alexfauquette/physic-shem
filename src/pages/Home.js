import React from "react";

import { useTranslation } from "react-i18next";

import { Link as RouterLink } from "react-router-dom";

import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import IconButton from "@material-ui/core/IconButton";

import GitHubIcon from "@material-ui/icons/GitHub";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  toolBar: {
    justifyContent: "space-between",
  },
  content: {
    display: "inline-block",
    width: "100%",
    "&>div:nth-child(2n)": {
      backgroundColor: "#2196f329",
    },
    "&>div:nth-child(2n+1)": {
      backgroundColor: "#64b5f670",
    },
    "& div": {
      padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
      "& h2": {
        fontSize: "1.5rem",
      },
      "& div": {
        padding: "1rem 0",
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-around",
        "& div, &>p ": {
          maxWidth: "30rem",
        },
        "& p": {
          fontSize: "1.2rem",
          margin: "0.5rem 1rem 1.5rem 0",
          lineHeight: 1.6,
        },
      },
      "& img": {
        maxHeight: "15rem",
        maxWidth: "100%",
      },
    },
  },
  contact: {
    textAlign: "center",
    padding: `${theme.spacing(4)}px ${theme.spacing(2)}px`,
    "& h2": {
      fontSize: "2rem",
    },
  },
  header: {
    marginTop: `${theme.spacing(8)}px `,
    padding: 0,
    display: "inline-block",
    width: "100%",
    textAlign: "center",
    backgroundImage: `url(${process.env.PUBLIC_URL + "/img/circuit.png"})`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  },
  headerTitle: {
    margin: "3em 1em 2em 1em",
    fontSize: "1.5rem",
  },
  textBox: {
    backgroundColor: "rgba(255, 255, 255, 0.7)",
  },
  name: {
    fontSize: "2rem",
  },

  callToActionContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    flex: "1 1 200px",
    paddingBottom: `${theme.spacing(8)}px`,
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
          <IconButton
            component="a"
            href={"https://github.com/alexfauquette/physic-shem"}
          >
            <GitHubIcon style={{ color: "white" }} fontSize="large" />
          </IconButton>
        </Toolbar>
      </AppBar>
      <div className={classes.header}>
        <div className={classes.headerTitle}>
          <h1>
            <span className={classes.textBox}>
              <span className={classes.name}>Physic Schem</span>
              {ready ? t("title") : ", votre générateur de schéma"}
            </span>
          </h1>
        </div>
        <div className={classes.callToActionContainer}>
          <Button
            component={RouterLink}
            to="/catalogue"
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
        <div>
          <h2>
            {ready
              ? t("paragraph1.title")
              : "Créez vos circuits en quelques cliques"}
          </h2>
          <div>
            <p>
              {ready
                ? t("paragraph1.txt")
                : "Lampes, interrupteurs, résistances. Les composants de base d'un circuit électrique sont disponible dans le menu de gauche. N'hésitez pas à signaler des composants qui vous manqueraient."}
            </p>
            <img src={`${process.env.PUBLIC_URL + "/img/addComponents.gif"}`} />
          </div>
        </div>
        <div>
          <h2>
            {ready
              ? t("paragraph2.title")
              : "Modifiez les composants facilement"}
          </h2>
          <div>
            <p>
              {ready
                ? t("paragraph2.txt")
                : "Besoin d'ajouter un courant, ou de nommer vos composant ? Sélectionnez le et les différents options vous seront présentées à droite."}
            </p>
            <img
              src={`${process.env.PUBLIC_URL + "/img/editProperties.gif"}`}
            />
          </div>
        </div>
        <div>
          <h2>
            {ready
              ? t("paragraph3.title")
              : "Exportez votre circuit en png, ou en code CircuiTikZ"}
          </h2>
          <div>
            <div>
              <p>
                {ready
                  ? t("paragraph3.txt1")
                  : "Récupérez votre circuit sous forme d'une image png. Ou récupérez du code CircuiTikZ pour l'intégrer directement dans vos documents LaTeX."}
              </p>
              <p>
                {ready
                  ? t("paragraph3.txt2")
                  : "N'hésitez pas à sauvegarder vos réalisations en ligne pour les partager avec d'autres utilisateurs."}
              </p>
            </div>
            <img src={`${process.env.PUBLIC_URL + "/img/export.gif"}`} />
          </div>
        </div>
        <div>
          <h2>
            {ready
              ? t("paragraph4.title")
              : "Découvrez CircuiTikZ grace au tutoriel interactif"}
          </h2>
          <div>
            <p>
              {ready
                ? t("paragraph4.txt1")
                : "Envie d'aller plus loin? Apprenez les rudiment de CircuiTikZ. Si vous ne connaissez pas encore LaTeX, "}
              <a
                href={
                  ready
                    ? t("paragraph4.link.url")
                    : "https://fr.wikibooks.org/wiki/LaTeX/G%C3%A9n%C3%A9ralit%C3%A9s"
                }
              >
                {ready ? t("paragraph4.link.txt") : "ce Wikibook"}
              </a>
              {ready
                ? t("paragraph4.txt2")
                : " vous donnera toutes les bases pour découvrir ce fabuleux langage."}
            </p>
            <img src={`${process.env.PUBLIC_URL + "/img/tuto.gif"}`} />
          </div>
        </div>
      </div>
      <div className={classes.contact}>
        <h2>{ready ? t("contact.title") : "Contact"}</h2>
        <p>
          {ready
            ? t("contact.txt")
            : "Cette application est toujours en cours de développement. N'hésitez pas à me contacter pour signaler un bug, demander une fonctionnalité ou toute autre remarque."}
        </p>
        <p>
          <a href="https://github.com/alexfauquette/physic-shem/issues">
            GitHub
          </a>
          , <a href="https://twitter.com/AleFauquette">Twitter</a> or directly
          at alex.fauquette [at] gmail [punto] com
        </p>
      </div>
    </div>
  );
};

// {ready ? t("paragraph1.title") : "Des schémas beau facilement"}

export default Home;
