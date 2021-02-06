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

export const drawRoughArrowEnd = (rc, x, y, angle, xScale, yScale) => {
  rc.path(`
      M ${rotation(
        angle,
        x,
        y,
        -dx * MULTIPLICATIVE_CONST,
        dy * MULTIPLICATIVE_CONST,
        xScale,
        yScale
      )}
  L ${x} ${y}
      L ${rotation(
        angle,
        x,
        y,
        -dx * MULTIPLICATIVE_CONST,
        -dy * MULTIPLICATIVE_CONST,
        xScale,
        yScale
      )}
      
  `);
};
export default ArrowEnd;
