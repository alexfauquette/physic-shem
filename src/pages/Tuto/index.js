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
        <p>
          Commençons par quelque chose de simple, dessiner une résistance. Pour
          cela on commence par écrire <code>\draw</code>, puis on indique le
          point de départ <code>(x, y)</code>. On indique ce que l'on veut
          tracer, <code>to</code> indique qu'il s'agit d'un dipôle, et{" "}
          <code>R</code> une résistance. Il ne reste plus qu'à indiquer le point
          d'arriver, et surtout mettre <code>;</code> pour dire que l'on a fini
          de dessiner. Souvent les erreurs de compilation viennent d'un oubli de{" "}
          <code>;</code> en fin de ligne.
        </p>
        <ExplanationPosition />
        <h2>Dessiner d'autres dipôles</h2>
        <p>
          Vous voulez dessiner autre chose ? Tant que c'est un dipôle, on va
          utiliser <code>to</code>. Il suffit alors de changer le contenu de
          crochets. Par exemple <code>C</code> vous donner un condensateur, et{" "}
          <code>battery1</code> une pile (comme vous vous en douté il existe
          aussi <code>battery</code> et <code>battery2</code>). Je vous laisse
          tester les dipôles présent pour l'instant dans physic-schem.
        </p>
        <ExplanationBipoles />
        <h2>Annoter ses composants</h2>
        <p>
          Il est fréquent que l'on veuille donner un petit nom à nos composants,
          tel que Robert le potentiomètre, ou plus classiquement la résistance
          R1. On peut aussi indiquer une information sur le composant, comme sa
          résistivité. Pour cela vous avez le label et l'annotation, qui sont
          des options à ajouter. Pour le label c'est <code>l=</code> et pour
          l'annotation c'est <code>a=</code>. Simple non ?
        </p>
        <p>
          Attention, physic-schem présente une grande limite comparé à
          l'utilisation de circuitikz : l'absence d'équation. En effet, je n'ai
          pas encore implémenté la gestion des équations LaTeX. ALors que si
          vous utilisez circuitikz, vous pouvez utiliser des équations dans vos
          labels et annotations. Par exemple une résistance R1 s'écrira{" "}
          <code>to[R, l=$R_1$]</code> pour avoir un R indice 1.
        </p>
        <ExplanationBipoles withAnnotations />

        <p>
          Attention aussi au sens de vos composants. Si vous regardez l'exemple
          suivant, vous remarquerez que la résistance à fait un demi tour avec
          des étapes intermédiaires. Celle de gauche est tracée de droite à
          gauche alors que celle de droite est tracée de gauche à droite, ce qui
          inverse le sens des labels et annotations.
        </p>
        <p>
          Retenez que l'ordre des coordonnées à un impact sur le sens du dipôle
          et donc sur le rendu
        </p>
        <ExplanationBipoles withAnnotations withMultipleComponents />
        <h2>Un peu d'esthétisme aux extrémités</h2>

        <p>
          Vous pouvez ajouter facilement des décorateurs aux extrémités de vos
          bipôles. Vous avez le choix entre <code>*</code>, <code>*</code> et{" "}
          <code>d</code> qui correspondent à un cercle plein, un cercle vide et
          un carreau (diamond en anglais). Je vous laisse tester si dessous les
          différentes combinaisons possibles et le code associé.
        </p>
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
        <p>
          Bon, la vie n'est pas faite que de dipôles. Il y a aussi le monopôles,
          qui sont souvent des indicateurs de tensions. Cette fois le{" "}
          <code>to</code> est remplacé par un <code>node</code>, et à la fin il
          nous faut ajouter <code>{}</code>. Entre ces accolades vous pouvez
          mettre un texte qui correspondra au label. La fonctionnalité n'existe
          pas encore dans physic-schem, mais l'accolade est obligatoire dans
          circuitikz. Vous pourrez la remplir à votre guise dans votre éditeur
          LaTeX préféré.
        </p>
        <ExplanationMonopole withAngle withPosition />
        <h2>Et des multipôles</h2>
        <p>
          Pour les multipôles même logique. Sauf qu'ils on plusieurs pôle. On va
          donc pouvoir choisir qu'elle pôle sert de point de référence. Pour
          celà on ajoute l'option <code>anchor=...</code>, remplacez les ... par
          le nom du pôle qui vous intéresse. Chaque composants à ses propres
          poles, mais rassurez vous ce sont des physiciens qui gèrent le code,
          les noms devraient vous être familier. Pour le nmos les poles sont{" "}
          <code>B</code>, <code>C</code>, <code>E</code>. Pour l'amplificateur
          opérationnel, il y a <code>+</code>, <code>-</code>, <code>out</code>{" "}
          pour les entrées sorties, et <code>up</code>, <code>down</code> pour
          les points d'alimentation.
        </p>
        <ExplanationMultipole withAnchor withAngle withPosition />
        <h2>Utiliser les points d'intérêt des multipôles</h2>

        <p>
          Maintenant on a un problème. Un fois mon multipôle placé, comment je
          fais pour brancher mes dipôles dessus ? Les créateurs de circuitikz
          ont pensé à tout. Commencez par donner un nom à votre multipôle comme
          ceci : <code>node[...](nomDuComposant) {}</code>. Dans l'exemple ci
          dessous, j'ai pris <code>opAmp</code> comme nom (oui, ce n'est pas
          très original). Vous pouvez maintenant utiliser ses pôles comme
          coordonnées avec les formule suivante :{" "}
          <code>(nomDuComposant.nomDuPole)</code>, ce qui donne{" "}
          <code>(opAmp.-)</code> pour obtenir la coordonnée du pole - de mon
          amplificateur opérationnel. Vous pouvez donc bouger ce multipôle
          autant que vous voulez, les résistances resteront bien attachées à
          lui.
        </p>
        <ExplanationAnchors withAngle withPosition />
        <h2>Utiliser des coordonnées relatives</h2>

        <p>
          Vous l'avez sans doute remarqué les résistance sont accrochées d'un
          côté, mais de l'autre tout est fixe. Pour remédier à celà, on va
          utiliser des coordonnées relatives. Pour cela un écrit{" "}
          <code>++(dx, dy)</code>, qui indique d'ajouter dx et dy à la
          précédente coordonnée pour obtenir la nouvelle. Vous pouvez maintenant
          bouger tout le bloc en modifiant uniquement la position de l'AOP.
        </p>
        <ExplanationAnchors withAngle withPosition useRelativeCoord />
      </div>
    </div>
  </div>
);

export default Tuto;
