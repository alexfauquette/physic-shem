import React from "react";
import { connect } from "react-redux";
import { startLinking, stopLinking } from "../redux/actions";
import { MODE_LINK, MODE_SELECT } from "../redux/store";
import "./style.scss";

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id ? { ...state.scene[props.id], mode: state.mode } : {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLinking: (id, x, y) => (event) => {
      event.stopPropagation();
      dispatch(startLinking(id, x, y));
    },
    stopLinking: (id, x, y) => (event) => {
      event.stopPropagation();
      dispatch(stopLinking(id, x, y));
    },
  };
};

const Resistance = ({
  x,
  y,
  mode,
  selected,
  showHandles,
  startLinking,
  stopLinking,
  id,
  ...props
}) =>
  x && y ? (
    <g
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
      className={`component ${selected ? "red" : "black"}`}
    >
      <g {...props}>
        <path d={`M -20 -10 L 20 -10 L 20 10 L -20 10 Z`} />
        <path d={`M -20 0 L -30 0`} />
        <path d={`M 20 0 L 30 0`} />

        <path
          d={`M -25 0 L 25 0`}
          style={{ stroke: "transparent", strokeWidth: "10" }}
        />
      </g>
      <circle
        cx={-30}
        cy={0}
        r={5}
        className="handle"
        onClick={
          (mode === MODE_SELECT && startLinking(id, x - 30, y)) ||
          (mode === MODE_LINK && stopLinking(id, x - 30, y)) ||
          null
        }
      />
      <circle
        cx={30}
        cy={0}
        r={5}
        className="handle"
        onClick={
          (mode === MODE_SELECT && startLinking(id, x + 30, y)) ||
          (mode === MODE_LINK && stopLinking(id, x + 30, y)) ||
          null
        }
      />

      {/* helper for selection */}
    </g>
  ) : null;
export default connect(mapStateToProps, mapDispatchToProps)(Resistance);
