import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const height = 0.6;
const width = 0.3 * 0.33;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

export const getBoundingBox = () => ({
  dx1: -UNIT_X,
  dx2: UNIT_X,
  dy1: -UNIT_Y,
  dy2: UNIT_Y,
});

const Battery1 = () => (
  <>
    <path
      d={`
      M ${-UNIT_X} ${-UNIT_Y}
      L ${-UNIT_X} ${UNIT_Y}
      M ${UNIT_X} ${-0.5 * UNIT_Y}
      L ${UNIT_X} ${0.5 * UNIT_Y}`}
    />
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

  const xScale = element.invert ? -1 : 1;
  const yScale = element.mirror ? -1 : 1;

  rc.path(
    `M ${rotation(-angle, x, y, -UNIT_X, -UNIT_Y, xScale, yScale)}
    L ${rotation(-angle, x, y, -UNIT_X, UNIT_Y, xScale, yScale)}
    M ${rotation(-angle, x, y, UNIT_X, 0.5 * UNIT_Y, xScale, yScale)}
    L ${rotation(-angle, x, y, UNIT_X, -0.5 * UNIT_Y, xScale, yScale)}
    `
  );
};

export const drawer = (element) => {
  return `to[battery1${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(Battery1);
