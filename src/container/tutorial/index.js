import React, { useState } from "react";

import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";

import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";

import options from "./options.png";
import save from "./save.png";
import selectElement from "./selectElement.png";

const titles = [
  "Select components to draw from the left menu.",
  "Modify properties of selected component with right menu",
  "Save and Export your creation with latex, png or json",
  "Some shortcut to simplify your experience",
];

const images = [selectElement, options, save];

const shortcuts = [
  {
    key: "S",
    description: "Split coordinate point in multiple points",
  },
  {
    key: "Shift",
    description: "Lock dragging along x or y axis",
  },
  {
    key: "Ctrl",
    description: "Allow to select multiple element",
  },
  {
    key: "Suppr",
    description: "Delete selected component (only one)",
  },
  {
    key: "Arrows",
    description: "Stack coordinates along given direction",
  },
];

const HelpShortcut = ({ classes }) => {
  const [showHelp, setShowHelp] = useState(!localStorage.getItem("dontShow"));
  const [helpStep, setHelpStep] = useState(
    localStorage.getItem("helpStep") || 0
  );

  const openHelp = () => setShowHelp(true);
  const closeHelp = () => {
    setShowHelp(false);
    localStorage.setItem("dontShow", true);
  };

  const next = () => {
    setHelpStep(Math.min(3, helpStep + 1));
    localStorage.setItem("dontShow", Math.min(3, helpStep + 1));
  };
  const prev = () => {
    setHelpStep(Math.max(0, helpStep - 1));
    localStorage.setItem("dontShow", Math.max(3, helpStep - 1));
  };

  return (
    <>
      <IconButton
        edge="start"
        className={classes.menuButton}
        color="inherit"
        aria-label="open drawer"
        onClick={openHelp}
      >
        <HelpOutlineIcon />
      </IconButton>
      <Dialog fullWidth maxWidth="sm" open={showHelp} onClose={closeHelp}>
        <DialogTitle>{titles[helpStep]}</DialogTitle>
        <DialogContent>
          {helpStep === 3 ? (
            <List>
              {shortcuts.map((shortcut) => (
                <ListItem key={shortcut.key}>
                  <ListItemText
                    classes={{ primary: classes.keyboardDescription }}
                    primary={shortcut.description}
                  />
                  <span className={classes.keyboardKey}>{shortcut.key}</span>
                </ListItem>
              ))}
            </List>
          ) : (
            <img
              src={images[helpStep]}
              alt={titles[helpStep]}
              style={{ width: "100%" }}
            />
          )}
        </DialogContent>
        <MobileStepper
          variant="dots"
          steps={4}
          position="static"
          activeStep={helpStep}
          nextButton={
            <Button size="small" onClick={next} disabled={helpStep === 3}>
              Next
              <KeyboardArrowRight />
            </Button>
          }
          backButton={
            <Button size="small" onClick={prev} disabled={helpStep === 0}>
              <KeyboardArrowLeft />
              Back
            </Button>
          }
        />
      </Dialog>
    </>
  );
};

export default HelpShortcut;
