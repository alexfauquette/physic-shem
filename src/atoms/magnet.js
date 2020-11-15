import React, { useState } from "react";
import { connect } from "react-redux";

import { updatePosition, stopDragging } from "../redux/actions";
import { MODE_DRAG } from "../redux/store";
const mapDispatchToProps = (dispatch, { attractor, attracted }) => {
  return {
    updatePosition: (x, y) =>
      dispatch(updatePosition({ x, y, id: attractor.id })),
    stopDragging: () => dispatch(stopDragging(attractor, attracted)),
  };
};

const Magnet = ({
  id,
  x,
  y,
  dx,
  dy,
  color,
  mode,
  updatePosition,
  stopDragging,
}) => {
  const [isUsed, setIsUsed] = useState(false);

  return (
    <>
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
      <circle
        cx={x + dx}
        cy={y + dy}
        r={10}
        style={{
          fill: color || "transparent",
        }}
        onMouseEnter={(event) => {
          event.stopPropagation();
          updatePosition(x + dx, y + dy);
          setIsUsed(true);
        }}
        onMouseLeave={() => setIsUsed(false)}
        onMouseMove={
          (event) => event.stopPropagation() //stop the propagation
        }
        onMouseUp={
          mode === MODE_DRAG
            ? (event) => {
                event.stopPropagation();
                stopDragging();
              }
            : null
        }
      />
    </>
  );
};

export default connect(null, mapDispatchToProps)(Magnet);
