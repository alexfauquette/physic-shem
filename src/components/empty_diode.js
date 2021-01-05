import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const height = 0.5;
const width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

export const getBoundingBox = () => ({
  dx1: -UNIT_X,
  dx2: UNIT_X,
  dy1: -UNIT_Y,
  dy2: UNIT_Y,
});

const EmptyDiode = () => (
  <>
    <path
      d={`M ${UNIT_X} 0 L ${-UNIT_X} ${-UNIT_Y} L ${-UNIT_X} ${UNIT_Y} Z`}
    />
    <path d={`M ${UNIT_X} ${UNIT_Y} L ${UNIT_X} ${-UNIT_Y}`} />
  </>
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
    `M ${rotation(-angle, x, y, UNIT_X, 0)}
    L ${rotation(-angle, x, y, -UNIT_X, -UNIT_Y)}
    L ${rotation(-angle, x, y, -UNIT_X, UNIT_Y)}
    Z
    M ${rotation(-angle, x, y, UNIT_X, UNIT_Y)}
    L ${rotation(-angle, x, y, UNIT_X, -UNIT_Y)}
    `
  );
};

export const drawer = (element) => {
  return `to[empty diode${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(EmptyDiode);
