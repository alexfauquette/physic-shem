import React from "react";
import { connect } from "react-redux";

const style = {
  fill: "transparent",
  stroke: "black",
  strokeWidth: 2,
};

const mapStateToProps = (state) => ({ x: state.x, y: state.y });

const mapDispatchToProps = (dispatch) => {
  return {
    // dispatching plain actions
    incrementX: () => dispatch({ type: "INCREMENT_X" }),
    decrementY: () => dispatch({ type: "INCREMENT_Y" }),
  };
};

const Lampe = ({ x, y, incrementX, decrementY, ...props }) => (
  <g
    style={{ transform: `translate(${x}px,${y}px)` }}
    {...props}
    onMouseOver={incrementX}
  >
    <circle cx={0} cy={0} r={10} style={style} />
    <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} style={style} />
  </g>
);
export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
