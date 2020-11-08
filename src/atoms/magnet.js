import React from "react";
import { connect } from "react-redux";

import { updatePosition } from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    updatePosition: (x, y, id) => dispatch(updatePosition({ x, y, id })),
  };
};

const Magnet = ({ id, x, y, color, updatePosition }) => (
  <circle
    cx={x}
    cy={y}
    r={10}
    style={{
      fill: color || "transparent",
    }}
    onMouseEnter={(event) => {
      event.stopPropagation();
      updatePosition(x, y, id);
    }}
    onMouseMove={
      (event) => event.stopPropagation() //stop the propagation
    }
  />
);

export default connect(null, mapDispatchToProps)(Magnet);
