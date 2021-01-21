import React from "react";
import classes from "./index.module.scss";

import { Trans, useTranslation } from "react-i18next";

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

const Tuto = () => {
  const { t, i18n, ready } = useTranslation("tutorial");

  return (
    // TODO : Proper listen key event
    <div>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar className={classes.toolBar}>
          <>
            <Link component={RouterLink} to="/home" color="inherit">
              <Typography variant="h6" noWrap>
                Physic Schem
              </Typography>
            </Link>
          </>
        </Toolbar>
      </AppBar>
      <div className={classes.contentContainer}>
        <div className={classes.content}>
          <h2>{ready && <Trans t={t} i18nKey="importModule.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="importModule.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <pre className={classes.latexArea}>{"\\usepackage{circuitikz}"}</pre>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="importModule.paragraph2"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <pre>
            {
              "\\documentclass{article}\n\n\\usepackage[utf8]{inputenc}\n\\usepackage{circuitikz}\n\n\\title{Mon document}\n\n\\begin{document}\n\n\\begin{circuitikz}\n\t% ici je met mon code\n\\end{circuitikz}\n\n\\end{document}"
            }
          </pre>
          <h2>{ready && <Trans t={t} i18nKey="bipolePosition.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipolePosition.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationPosition />
          <h2>{ready && <Trans t={t} i18nKey="bipoleNames.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipolePosition.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationBipoles />
          <h2>{ready && <Trans t={t} i18nKey="bipoleAnnotations.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleAnnotations.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleAnnotations.paragraph2"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationBipoles withAnnotations />

          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleAnnotations.paragraph3"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleAnnotations.paragraph4"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationBipoles withAnnotations withMultipleComponents />
          <h2>{ready && <Trans t={t} i18nKey="bipoleDecorations.title" />}</h2>

          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleDecorations.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationDecoraion />
          <h2>{ready && <Trans t={t} i18nKey="bipoleCurrant.title" />}</h2>
          <p>
            {ready && (
              <>
                <Trans
                  t={t}
                  i18nKey="bipoleCurrant.paragraph1.1"
                  components={{ c: <code /> }}
                />
                <code>{"<"}</code>
                <Trans t={t} i18nKey="bipoleCurrant.paragraph1.2" />
              </>
            )}
          </p>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="bipoleCurrant.paragraph2"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationCurrant />
          <h2>{ready && <Trans t={t} i18nKey="monopole.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="monopole.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationMonopole withAngle withPosition />
          <h2>{ready && <Trans t={t} i18nKey="multipoles.title" />}</h2>
          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="multipoles.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationMultipole withAnchor withAngle withPosition />
          <h2>
            {ready && <Trans t={t} i18nKey="multipolesPointOfInterest.title" />}
          </h2>

          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="multipolesPointOfInterest.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationAnchors withAngle withPosition />
          <h2>
            {ready && <Trans t={t} i18nKey="relative coordinates.title" />}
          </h2>

          <p>
            {ready && (
              <Trans
                t={t}
                i18nKey="relative coordinates.paragraph1"
                components={{ c: <code /> }}
              />
            )}
          </p>
          <ExplanationAnchors withAngle withPosition useRelativeCoord />
        </div>
      </div>
    </div>
  );
};

export default Tuto;
