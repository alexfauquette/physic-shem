import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "utils/constantes";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "../atoms/currant";

const height = 0.35;
const width = 0.35;

const Arrow = ({ x, y, r, theta1, theta2 }) => {
  const x1 = x + r * Math.cos((theta1 / 180) * Math.PI);
  const y1 = y - r * Math.sin((theta1 / 180) * Math.PI);

  const x2 = x + r * Math.cos((theta2 / 180) * Math.PI);
  const y2 = y - r * Math.sin((theta2 / 180) * Math.PI);

  return (
    <path
      d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${
        theta1 < theta2 ? 0 : 1
      } ${x2} ${y2} `}
    />
  );
};

const Switch = ({ isOpen, withArrow }) => {
  const height = withArrow ? 0.35 : 0.3;

  const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
  const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;
  if (withArrow) {
    return (
      <>
        <Arrow
          x={-UNIT_X}
          y={0}
          r={1.2 * UNIT_X}
          theta1={isOpen ? -10 : 90}
          theta2={isOpen ? 90 : -20}
        />
        <path d={`M ${-UNIT_X} 0 L ${0.6 * UNIT_X} ${-UNIT_Y}`} />
      </>
    );
  }

  return (
    <path
      d={`M ${-UNIT_X} 0 L ${0.9 * UNIT_X} ${-UNIT_Y} M ${UNIT_X} 0 L ${
        0.2 * UNIT_X
      } 0 L ${0.2 * UNIT_X} ${-UNIT_Y}`}
    />
  );
};

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const { x, y, angle, ratio } = drawLinks(
    rc,
    ctx,
    x0,
    y0,
    width,
    height,
    element
  );

  drawRoughCurrant(rc, ctx, x0, y0, angle, ratio, element);

  // rc.path(
  //   `M ${rotation(-angle, x, y, UNIT_X, 0)}
  //   L ${rotation(-angle, x, y, -UNIT_X, -UNIT_Y)}
  //   L ${rotation(-angle, x, y, -UNIT_X, UNIT_Y)}
  //   Z
  //   M ${rotation(-angle, x, y, UNIT_X, UNIT_Y)}
  //   L ${rotation(-angle, x, y, UNIT_X, -UNIT_Y)}
  //   `
  // );
};

export const drawer = (element) => {
  const { isOpen, withArrow } = element;
  if (withArrow) {
    return `to[${isOpen ? "opening " : ""}switch${getPathAttributes(
      element
    )}] `;
  }
  return `to[normal ${isOpen ? "open" : "closed"} switch${getPathAttributes(
    element
  )}] `;
};

export default withPathAttributes({ width, height })(Switch);
