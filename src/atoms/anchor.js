import React, { forwardRef } from "react";

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
  return id
    ? {
        x: state.coordinates.byId[id].x,
        y: state.coordinates.byId[id].y,
        shape: state.coordinates.byId[id].shape,
        mode: state.mode,
        selected: state.selection.includes(id),
      }
    : {};
};

const Anchor = ({
  id,
  x,
  y,
  shape,
  mode,
  selected,
  startDragging,
  toggleSelection,
}) => {
  switch (shape) {
    case "d":
      return (
        <path
          d={`M ${x - 5} ${y} L ${x} ${y - 5} L ${x + 5} ${y} L ${x} ${
            y + 5
          } Z`}
          className={`anchor full ${selected ? "selected" : ""} `}
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

    default:
      return (
        <circle
          cx={x}
          cy={y}
          r={5}
          className={`anchor ${selected ? "selected" : ""} ${
            shape === "o" ? " empty" : ""
          }${shape === "*" ? " full" : ""}`}
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
  }
};

export const roughCoordinate = (rc, ctx, x0, y0, { x, y, shape }) => {
  if (shape === "o") {
    rc.circle(x - x0, y - y0, 10, {
      fill: "white",
      fillStyle: "solid",
      roughness: rc.gen.config.options.roughness / 2,
    });
  }
  if (shape === "*") {
    rc.circle(x - x0, y - y0, 10, {
      fill: "black",
      fillStyle: "solid",
      roughness: rc.gen.config.options.roughness / 2,
    });
  }
  if (shape === "d") {
    rc.path(
      `M ${x - x0 - 5} ${y - y0}
      L ${x - x0} ${y - y0 - 5}
      L ${x - x0 + 5} ${y - y0}
      L ${x - x0} ${y - y0 + 5}
      Z`,
      {
        fill: "black",
        fillStyle: "solid",
        roughness: rc.gen.config.options.roughness / 2,
      }
    );
  }
};
const ConnectedAnchor = connect(mapStateToProps, mapDispatchToProps)(Anchor);

export default forwardRef((props, ref) => (
  <ConnectedAnchor {...props} svgRef={ref} />
));
