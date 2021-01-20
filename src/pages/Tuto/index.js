import React from "react";
import classes from "./index.module.scss";

import { Link as RouterLink } from "react-router-dom";
import Link from "@material-ui/core/Link";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";

import ExplanationCurrant from "tutorial/currantExplanation";
import ExplanationPosition from "tutorial/positionExplanation";
import ExplanationBipoles from "tutorial/bipoleExplanation";
import ExplanationDecoraion from "tutorial/decorationExplanation";
import ExplanationMonopole from "tutorial/monopoleExplanation";
import ExplanationMultipole from "tutorial/multipoleExplanation";
import ExplanationAnchors from "tutorial/anchorExplanation";

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
        <h2>Importer circuitikz</h2>
        <p>
          Première chose à faire, importer le package circuitikz. Pour cela rien
          de plus simple, vous ajoutez <code>{"\\usepackage{circuitikz}"}</code>{" "}
          dans l'entête de votre document LaTeX. Pour être précis, là où il y a
          toutes les autres lignes commençant par{" "}
          <code>{"\\usepackage{...}"}</code>.
        </p>
        <pre className={classes.latexArea}>{"\\usepackage{circuitikz}"}</pre>
        <p>
          Et voilà, vous êtes prêt à utiliser circuitikz. Pour cela, à
          l'interieur du document ouvrez une zone de dessin avec{" "}
          <code>{"\\begin{circuitikz}"}</code>, et fermez là comme d'habitude
          avec <code>{"\\end{circuitikz}"}</code>. Votre code devrait ressembler
          à ceci :
        </p>
        <pre>
          {
            "\\documentclass{article}\n\n\\usepackage[utf8]{inputenc}\n\\usepackage{circuitikz}\n\n\\title{Mon document}\n\n\\begin{document}\n\n\\begin{circuitikz}\n\t% ici je met mon code\n\\end{circuitikz}\n\n\\end{document}"
          }
        </pre>
        <h2>Dessiner une résistance</h2>
        <ExplanationPosition />
        <h2>Dessiner d'autres dipôles</h2>
        <ExplanationBipoles />
        <h2>Annoter ses composants</h2>
        <ExplanationBipoles withAnnotations />
        <ExplanationBipoles withAnnotations withMultipleComponents />
        <h2>Un peu d'esthétisme aux extrémités</h2>
        <ExplanationDecoraion />
        <h2>Ajouter du courant</h2>
        <p>
          Il est assez courant de vouloir dessiner les courant passant à travers
          un composant. Pour cela rien de plus simple, il suffit d'ajouter{" "}
          <code>i=i1</code>. Vous pouvez modifier le sens de la flèche, sa
          position et la place du texte avec les characters <code>^</code> et{" "}
          <code>_</code> pour la place du texte (au dessus en dessous). Les
          characters <code>{">"}</code> et <code>{"<"}</code> pour le sens de la
          flèche. Leur ordre indique la place de la flèche. Je vous laisse
          tester par vous même ca sera plus simple.
        </p>
        <p>
          Petit point d'attention, si vous inverser l'ordre des coordonnées,
          c'est comme si vous aviez fait une rotation de 180° à votre composant.
          Tous sera donc inversé.
        </p>
        <ExplanationCurrant />
        <h2>Dessiner un monopôle</h2>
        <ExplanationMonopole withAngle withPosition />
        <h2>Et des multipôles</h2>
        <ExplanationMultipole withAnchor withAngle withPosition />
        <h2>Utiliser les points d'intérêt des multipôles</h2>

        <ExplanationAnchors withAngle withPosition />
        <h2>Utiliser des coordonnées relatives</h2>
        <ExplanationAnchors withAngle withPosition useRelativeCoord />
      </div>
    </div>
  </div>
);

export default Tuto;
