import React from "react";
import { connect } from "react-redux";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const mapStateToProps = (state) => {
  if (
    state.selection.length < 1 ||
    !state.pathComponents.allIds.includes(state.selection[0])
  ) {
    return {};
  }
  const idOfInterest = state.selection[0];
  return {
    options: state.pathComponents.byId[idOfInterest],
  };
};

const ElementOptions = ({ options = null }) => {
  if (options === null) {
    return null;
  }
  return (
    <List>
      {Object.keys(options).map((name) => (
        <ListItem button key={name}>
          <ListItemText primary={name} secondary={options[name]} />
        </ListItem>
      ))}
    </List>
  );
};

export default connect(mapStateToProps)(ElementOptions);
