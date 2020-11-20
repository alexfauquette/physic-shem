import React from "react";

import "./style.scss";
import { connect } from "react-redux";
import { MODE_SELECT } from "../redux/store";
import { toggleSelection, startDragging } from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSelection: (objectId, reset) =>
      dispatch(toggleSelection(objectId, reset)),
    startDragging: (x, y) => dispatch(startDragging(x, y)),
  };
};
const mapStateToProps = (state, { id }) => {
  return {
    x: state.anchors.byId[id].x,
    y: state.anchors.byId[id].y,
    mode: state.mode,
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
}) => (
  <circle
    cx={x}
    cy={y}
    r={5}
    className={`anchor ${selected ? "selected" : ""}`}
    onMouseDown={
      mode === MODE_SELECT
        ? (event) => {
            event.stopPropagation();
            if (!event.ctrlKey && selected) {
              startDragging(
                event.nativeEvent.offsetX,
                event.nativeEvent.offsetY
              );
            } else {
              toggleSelection(id, !event.ctrlKey);
            }
          }
        : null
    }
  />
);

export default connect(mapStateToProps, mapDispatchToProps)(Anchor);
