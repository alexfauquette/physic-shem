import {
  DialogContent,
  DialogTitle,
  Typography,
  List,
  ListItem,
  ListItemText,
} from "@material-ui/core";
import React from "react";

import { makeStyles } from "@material-ui/core/styles";

const shortcuts = [
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

const useStyles = makeStyles(() => ({
  keyboardKey: {
    backgroundColor: "#eee",
    borderRadius: "3px",
    border: "1px solid #b4b4b4",
    boxShadow:
      "0 1px 1px rgba(0, 0, 0, .2), 0 2px 0 0 rgba(255, 255, 255, .7) inset",
    color: "#333",
    display: "inline-block",
    fontSize: "1.5em",
    fontWeight: 600,
    lineHeight: 1,
    padding: "8px 8px",
  },
  keyboardDescription: {
    fontSize: "1.4rem",
  },
}));

const HelpShortcut = () => {
  const classes = useStyles();

  return (
    <>
      <DialogTitle>
        <Typography variant="h4" component="h2">
          Short Cut
        </Typography>
      </DialogTitle>
      <DialogContent>
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
      </DialogContent>
    </>
  );
};

export default HelpShortcut;
