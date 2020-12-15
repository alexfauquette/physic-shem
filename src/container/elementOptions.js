import React from "react";
import { connect } from "react-redux";

import { updateComponent } from "../redux/actions";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import Input from "@material-ui/core/Input";

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (id, name) => (event) =>
      dispatch(updateComponent(id, name, event.target.value)),
  };
};

const mapStateToProps = (state) => {
  if (
    state.selection.length < 1 ||
    !state.pathComponents.allIds.includes(state.selection[0])
  ) {
    return {};
  }
  const idOfInterest = state.selection[0];
  return {
    id: idOfInterest,
    options: state.pathComponents.byId[idOfInterest],
  };
};

const ElementOptions = ({ handleInputChange, id, options = null }) => {
  if (options === null) {
    return null;
  }
  return (
    <List>
      {Object.keys(options).map((name) => (
        <ListItem button key={name}>
          {name === "angle" ? (
            <>
              <ListItemText primary={name} />
              <ListItemSecondaryAction>
                <Input
                  value={options[name] || 0}
                  onKeyDown={(e) => e.stopPropagation()}
                  onChangeCapture={handleInputChange(id, name)}
                  inputProps={{
                    step: 5,
                    min: -180,
                    max: 180,
                    type: "number",
                  }}
                />
              </ListItemSecondaryAction>
            </>
          ) : (
            <ListItemText primary={name} secondary={options[name]} />
          )}
        </ListItem>
      ))}
    </List>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementOptions);
