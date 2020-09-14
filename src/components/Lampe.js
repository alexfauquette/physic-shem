import React from "react";
import { connect } from "react-redux";
import { startLinking } from "../redux/actions";
import "./style.scss";

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id ? state.scene[props.id] : {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    startLinking: (id, x, y) => (event) => {
      console.log("handle click");
      event.stopPropagation();
      dispatch(startLinking(id, x, y));
    },
  };
};

const Lampe = ({ x, y, selected, showHandles, startLinking, id, ...props }) =>
  x && y ? (
    <g
      style={{
        transform: `translate(${x}px,${y}px)`,
      }}
      className={`component ${selected ? "red" : "black"}`}
    >
      <g {...props}>
        <circle cx={0} cy={0} r={10} />
        <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} />
        <path d={`M -20 0 L -10 0`} />
        <path d={`M 20 0 L 10 0`} />
        <path
          d={`M -25 0 L 25 0`}
          style={{ stroke: "transparent", strokeWidth: "10" }}
        />
      </g>
      <circle
        cx={-20}
        cy={0}
        r={5}
        className="handle"
        onClick={startLinking(id, x - 20, y)}
      />
      <circle
        cx={20}
        cy={0}
        r={5}
        className="handle"
        onClick={startLinking(id, x + 20, y)}
      />

      {/* helper for selection */}
    </g>
  ) : null;
export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
