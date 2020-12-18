import React from "react";
import { connect } from "react-redux";

import { updateComponent } from "../redux/actions";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (id, name) => (value) => (event) =>
      dispatch(
        updateComponent(id, name, value === null ? event.target.value : value)
      ),
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

const inputElement = {
  angle: (value, update) => (
    <ListItem button>
      <ListItemText primary="rotation" />
      <ListItemSecondaryAction>
        <Input
          value={value || 0}
          onKeyDown={(e) => e.stopPropagation()}
          onChangeCapture={update(null)}
          inputProps={{
            step: 5,
            min: -180,
            max: 180,
            type: "number",
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ),
  label: (value, update) => (
    <ListItem>
      <TextField
        label="Label"
        value={value}
        onKeyDown={(e) => e.stopPropagation()}
        onChangeCapture={update(null)}
      />
    </ListItem>
  ),
  annotation: (value, update) => (
    <ListItem>
      <TextField
        label="Annotation"
        value={value}
        onKeyDown={(e) => e.stopPropagation()}
        onChangeCapture={update(null)}
      />
    </ListItem>
  ),
  currant: (value, update) => (
    <>
      <ListItem button>
        <ListItemText primary="Currant" />
        <ListItemSecondaryAction>
          <Checkbox
            checked={value.show}
            onChange={update({ ...value, show: !value.show })}
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </ListItemSecondaryAction>
      </ListItem>
      <ListItem>
        <TextField
          disabled={!value.show}
          label="Currant name"
          value={value.currantText}
          onKeyDown={(e) => e.stopPropagation()}
          onChangeCapture={(e) =>
            update({ ...value, currantText: e.target.value })()
          }
        />
      </ListItem>
      <ListItem>
        <FormControlLabel
          disabled={!value.show}
          control={
            <Switch
              checked={value.currantIsForward}
              onChange={update({
                ...value,
                currantIsForward: !value.currantIsForward,
              })}
              name="arrow direction"
            />
          }
          label="direction"
        />
      </ListItem>
      <ListItem>
        <FormControlLabel
          disabled={!value.show}
          control={
            <Switch
              checked={value.currantIsAfter}
              onChange={update({
                ...value,
                currantIsAfter: !value.currantIsAfter,
              })}
              name="currant position"
            />
          }
          label="arrow position"
        />
      </ListItem>
      <ListItem>
        <FormControlLabel
          disabled={!value.show}
          control={
            <Switch
              checked={value.currantIsAbove}
              onChange={update({
                ...value,
                currantIsAbove: !value.currantIsAbove,
              })}
              name="text position"
            />
          }
          label="text position"
        />
      </ListItem>
    </>
  ),
};

const ElementOptions = ({ handleInputChange, id, options = null }) => {
  if (options === null) {
    return null;
  }
  return (
    <List>
      {Object.keys(options).map((name) =>
        inputElement[name] ? (
          <div key={name}>
            {inputElement[name](options[name], handleInputChange(id, name))}
          </div>
        ) : null
      )}
    </List>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementOptions);
