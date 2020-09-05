import React from "react";

const style = {
  fill: "transparent",
  stroke: "black",
  strokeWidth: 2,
};
const Lampe = ({ x, y, ...props }) => (
  <g style={{ transform: `translate(${x}px,${y}px)` }} {...props}>
    <circle cx={0} cy={0} r={10} style={style} />
    <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} style={style} />
  </g>
);
export default Lampe;
