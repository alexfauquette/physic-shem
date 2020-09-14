import React from "react";
import { connect } from "react-redux";
import "./style.scss";

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id ? state.scene[props.id] : {};
};

const mapDispatchToProps = () => {
  return {};
};

const Lampe = ({ x, y, selected, showHandles, ...props }) =>
  x && y ? (
    <g
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
      className={`component ${selected ? "red" : "black"}`}
      {...props}
    >
      <circle cx={0} cy={0} r={10} />
      <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} />
      <path d={`M -20 0 L -10 0`} />
      <path d={`M 20 0 L 10 0`} />
      <circle cx={-20} cy={0} r={5} className="handle" />
      <circle cx={20} cy={0} r={5} className="handle" />
      <path
        d={`M -20 0 L 20 0`}
        style={{ stroke: "transparent", strokeWidth: "10" }}
      />
      {/* helper for selection */}
    </g>
  ) : null;
export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
