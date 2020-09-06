import React from "react";
import { connect } from "react-redux";

const style = {
  fill: "transparent",
  stroke: "black",
  strokeWidth: 2,
};

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id ? state.scene[props.id] : {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const Lampe = ({ x, y, ...props }) =>
  x && y ? (
    <g style={{ transform: `translate(${x}px,${y}px)` }} {...props}>
      <circle cx={0} cy={0} r={10} style={style} />
      <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} style={style} />
    </g>
  ) : null;
export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
