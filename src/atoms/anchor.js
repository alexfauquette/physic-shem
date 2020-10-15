import React from "react";
import { connect } from "react-redux";
import {
  MODE_SELECT,
  MODE_CREATE_ANCHOR,
  MODE_CREATE_PATH_ELEMENT,
} from "../redux/store";
import {
  toggleSelection,
  startDragging,
  updateAnchorCreation,
  invalidateFirstStepPathElementCreation,
  updatePathElementCreation,
} from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSelection: (objectId) => dispatch(toggleSelection(objectId)),
    startDragging: (x, y) => dispatch(startDragging(x, y)),

    updateAnchorCreation: (x, y, id) =>
      dispatch(updateAnchorCreation(x, y, id)),
    invalidateFirstStepPathElementCreation: () =>
      dispatch(invalidateFirstStepPathElementCreation()),
    updatePathElementCreation: (x, y, id) =>
      dispatch(updatePathElementCreation(x, y, id)),
  };
};
const mapStateToProps = (state, { id }) => {
  return {
    x: state.anchors.byId[id].x,
    y: state.anchors.byId[id].y,
    mode: state.mode,
    newPath: state.mode === MODE_CREATE_PATH_ELEMENT ? state.newPath : null, //Think it elps to not rerende (not sure)
    selected: state.selection.includes(id),
  };
};

const Anchor = ({
  id,
  x,
  y,
  mode,
  selected,
  startDragging,
  toggleSelection,
  newPath,
  updateAnchorCreation,
  invalidateFirstStepPathElementCreation,
  updatePathElementCreation,
}) => (
  <circle
    cx={x}
    cy={y}
    r={5}
    style={{
      fill: selected ? "red" : null,
    }}
    onMouseEnter={
      mode === MODE_CREATE_ANCHOR
        ? () => updateAnchorCreation(x, y, id)
        : mode === MODE_CREATE_PATH_ELEMENT
        ? newPath.isFromValidated && id === newPath.from.id
          ? () => invalidateFirstStepPathElementCreation()
          : () => updatePathElementCreation(x, y, id)
        : null
    }
    onMouseMove={
      // revent from moving the "increation anchor when moving on the anchor"
      mode === MODE_CREATE_PATH_ELEMENT || mode === MODE_CREATE_ANCHOR
        ? (event) => {
            event.stopPropagation();
          }
        : null
    }
    onMouseDown={
      mode === MODE_SELECT
        ? selected
          ? (event) => {
              event.stopPropagation();
              if (!event.ctrlKey) {
                startDragging(
                  event.nativeEvent.offsetX,
                  event.nativeEvent.offsetY
                );
              } else {
                toggleSelection(id);
              }
            }
          : (event) => {
              event.stopPropagation();
              toggleSelection(id);
            }
        : null
    }
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(Anchor);
