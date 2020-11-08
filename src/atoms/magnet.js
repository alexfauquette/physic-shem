import React, { useState } from "react";
import { connect } from "react-redux";

import { updatePosition } from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    updatePosition: (x, y, id) => dispatch(updatePosition({ x, y, id })),
  };
};

const Magnet = ({ id, x, y, dx, dy, color, updatePosition }) => {
  const [isUsed, setIsUsed] = useState(false);

  return (
    <>
      <circle
        cx={x + dx}
        cy={y + dy}
        r={10}
        style={{
          fill: color || "transparent",
        }}
        onMouseEnter={(event) => {
          event.stopPropagation();
          updatePosition(x + dx, y + dy, id);
          setIsUsed(true);
        }}
        onMouseLeave={() => setIsUsed(false)}
        onMouseMove={
          (event) => event.stopPropagation() //stop the propagation
        }
      />
      {isUsed && (
        <circle
          cx={x}
          cy={y}
          r={5}
          style={{
            fill: "none",
            stroke: "red",
            strokeWidth: 2,
          }}
        />
      )}
    </>
  );
};

export default connect(null, mapDispatchToProps)(Magnet);
