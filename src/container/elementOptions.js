import React from "react";
import { connect } from "react-redux";

import { updateComponent } from "redux/actions";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import Input from "@material-ui/core/Input";
import Checkbox from "@material-ui/core/Checkbox";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const mapDispatchToProps = (dispatch) => {
  return {
    handleInputChange: (id, name) => (value) => (event) =>
      dispatch(
        updateComponent(id, name, value === null ? event.target.value : value)
      ),
  };
};

const mapStateToProps = (state) => {
  if (state.selection.length < 1) {
    return {};
  }
  const idOfInterest = state.selection[0];

  return {
    id: idOfInterest,
    options:
      state.components.byId[idOfInterest] ||
      state.coordinates.byId[idOfInterest] ||
      {},
  };
};

const inputElement = {
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
  wiper_pos: (value, update) => (
    <ListItem button>
      <ListItemText primary="wiper position" />
      <ListItemSecondaryAction>
        <Input
          value={value || 0}
          onKeyDown={(e) => e.stopPropagation()}
          onChangeCapture={update(null)}
          inputProps={{
            step: 0.01,
            min: 0,
            max: 1,
            type: "number",
          }}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ),
  isOpen: (value, update) => (
    <ListItem>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={update(!value)} name="isOpen" />
        }
        label="isOpen"
      />
    </ListItem>
  ),
  withArrow: (value, update) => (
    <ListItem>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={update(!value)} name="withArrow" />
        }
        label="withArrow"
      />
    </ListItem>
  ),
  mirror: (value, update) => (
    <ListItem>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={update(!value)} name="mirror" />
        }
        label="mirror"
      />
    </ListItem>
  ),
  invert: (value, update) => (
    <ListItem>
      <FormControlLabel
        control={
          <Switch checked={value} onChange={update(!value)} name="invert" />
        }
        label="Invert"
      />
    </ListItem>
  ),
  shape: (value, update) => (
    <ListItem>
      <ListItemText primary="shape" />
      <ListItemSecondaryAction>
        <Select value={value} onChange={update(null)}>
          <MenuItem value=""></MenuItem>
          <MenuItem value="*">*</MenuItem>
          <MenuItem value="o">o</MenuItem>
          <MenuItem value="d">d</MenuItem>
        </Select>
      </ListItemSecondaryAction>
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
      {Object.keys(options)
        .map((name) => [
          name,
          Object.keys(inputElement).findIndex((n) => n === name),
        ])
        .filter(([, index]) => index >= 0)
        .sort(([, i1], [, i2]) => i1 - i2)
        .map(([name]) => (
          <div key={name}>
            {inputElement[name](options[name], handleInputChange(id, name))}
          </div>
        ))}
    </List>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ElementOptions);
