import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const height = 0.3;
const width = 0.8;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

const R = () => (
  <path
    d={`M ${(-6 / 6) * UNIT_X} 0 L ${(-5 / 6) * UNIT_X} ${-UNIT_Y} L ${
      (-3 / 6) * UNIT_X
    } ${UNIT_Y} L ${(-1 / 6) * UNIT_X} ${-UNIT_Y} L ${
      (1 / 6) * UNIT_X
    } ${UNIT_Y} L ${(3 / 6) * UNIT_X} ${-UNIT_Y} L ${
      (5 / 6) * UNIT_X
    } ${UNIT_Y} L ${(6 / 6) * UNIT_X} 0`}
  />
);

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
  rc.path(
    `M ${rotation(-angle, x, y, -UNIT_X, 0)}
    L ${rotation(-angle, x, y, (-5 / 6) * UNIT_X, -UNIT_Y)} 
    L ${rotation(-angle, x, y, (-3 / 6) * UNIT_X, UNIT_Y)} 
    L ${rotation(-angle, x, y, (-1 / 6) * UNIT_X, -UNIT_Y)} 
    L ${rotation(-angle, x, y, (1 / 6) * UNIT_X, UNIT_Y)} 
    L ${rotation(-angle, x, y, (3 / 6) * UNIT_X, -UNIT_Y)} 
    L ${rotation(-angle, x, y, (5 / 6) * UNIT_X, UNIT_Y)} 
    L ${rotation(-angle, x, y, UNIT_X, 0)}`
  );
};

export const drawer = (element) => {
  return `to[R${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(R);
