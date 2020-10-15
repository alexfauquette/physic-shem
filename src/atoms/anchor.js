import React from "react";
import { connect } from "react-redux";
import { MODE_SELECT } from "../redux/store";
import { toggleSelection, startDragging } from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSelection: (objectId) => dispatch(toggleSelection(objectId)),
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
    style={{
      fill: selected ? "red" : null,
    }}
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
