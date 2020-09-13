import React from "react";
import { connect } from "react-redux";

const style = {
  fill: "transparent",
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

const Lampe = ({ x, y, selected, ...props }) =>
  x && y ? (
    <g
      style={{
        transform: `translate(${x}px,${y}px)`,
        stroke: selected ? "red" : "black",
      }}
      {...props}
    >
      <circle cx={0} cy={0} r={10} style={style} />
      <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} style={style} />
      <path d={`M -20 0 L -10 0`} style={style} />
      <path d={`M 20 0 L 10 0`} style={style} />
      {selected && (
        <>
          <circle cx={-20} cy={0} r={5} style={style} />
          <circle cx={20} cy={0} r={5} style={style} />
        </>
      )}
    </g>
  ) : null;
export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
