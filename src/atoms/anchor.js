import React from "react";

import "./style.scss";
import { connect } from "react-redux";
import { MODE_SELECT } from "redux/store/interactionModes";
import { toggleSelection, startDragging } from "redux/actions";

const mapDispatchToProps = (dispatch, { svgRef, displayOptions }) => {
  return {
    toggleSelection: (objectId, reset) =>
      dispatch(toggleSelection(objectId, reset)),
    startDragging: (x, y) => {
      const {
        x: xOffset,
        y: yOffset,
        width: svgWidth,
        height: svgHeight,
      } = svgRef.current.getBoundingClientRect();
      const {
        x: SVG_X,
        y: SVG_Y,
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
        zoom,
      } = displayOptions;

      dispatch(
        startDragging(
          SVG_X + (x - xOffset) * (SVG_WIDTH / svgWidth),
          SVG_Y + (y - yOffset) * (SVG_HEIGHT / svgHeight)
        )
      );
    },
  };
};
const mapStateToProps = (state, { id }) => {
  return {
    x: state.coordinates.byId[id].x,
    y: state.coordinates.byId[id].y,
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
                event.nativeEvent.clientX,
                event.nativeEvent.clientY
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
