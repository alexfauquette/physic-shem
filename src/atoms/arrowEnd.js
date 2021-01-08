import React from "react";

import "components/style.scss";
import { MULTIPLICATIVE_CONST, rotation } from "utils";

const dx = 0.1;
const dy = 0.04;
const ArrowEnd = ({ x, y, angle }) => (
  <g
    style={{
      transform: `translate(${x}px , ${y}px) rotate(${angle}deg)`,
    }}
  >
    <path
      d={`M 0 0 L ${-dx * MULTIPLICATIVE_CONST} ${
        dy * MULTIPLICATIVE_CONST
      } L ${-dx * MULTIPLICATIVE_CONST} ${-dy * MULTIPLICATIVE_CONST} Z`}
      className="fill"
    />
  </g>
);

export const drawRoughArrowEnd = (
  rc,
  x,
  y,
  angle,
  x2,
  y2,
  theta,
  xScale = 1,
  yScale = 1
) => {
  const x0 =
    x +
    Math.cos((angle / 180) * Math.PI) * xScale * x2 -
    Math.sin((angle / 180) * Math.PI) * yScale * y2;

  const y0 =
    y +
    Math.sin((angle / 180) * Math.PI) * xScale * x2 +
    Math.cos((-angle / 180) * Math.PI) * yScale * y2;

  rc.path(`
      M ${x0} ${y0}
      L ${rotation(
        -angle - theta,
        x0,
        y0,
        -dx * MULTIPLICATIVE_CONST,
        -dy * MULTIPLICATIVE_CONST,
        xScale,
        yScale
      )}
      L ${rotation(
        -angle - theta,
        x0,
        y0,
        -dx * MULTIPLICATIVE_CONST,
        dy * MULTIPLICATIVE_CONST,
        xScale,
        yScale
      )}
      Z
  `);
};
export default ArrowEnd;
