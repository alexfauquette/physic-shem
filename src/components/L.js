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
const lower_coil_height = 0.15;
const width = 0.6;
const coils = 5;
const coil_aspect = 0.5;

const OTHER =
  (0.5 * coil_aspect * width * R_LEN * MULTIPLICATIVE_CONST) / (coils - 1); //width of small coil

const STEP =
  (width * R_LEN * MULTIPLICATIVE_CONST + (coils - 1) * 2 * OTHER) /
  (2 * coils);

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y_UP = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y_DOWN = 0.5 * lower_coil_height * MULTIPLICATIVE_CONST * R_LEN;

export const getBoundingBox = () => ({
  dx1: -UNIT_X,
  dx2: UNIT_X,
  dy1: -UNIT_Y_UP,
  dy2: UNIT_Y_DOWN,
});

const L = () => (
  <>
    <path
      d={`M ${-UNIT_X} 0
        ${[...Array(coils - 1)]
          .map(
            () =>
              `a ${STEP} ${UNIT_Y_UP} 0 0 1 ${
                2 * STEP
              } 0 a ${OTHER} ${UNIT_Y_DOWN} 0 0 1 ${-2 * OTHER} 0 `
          )
          .join("")}
        a ${STEP} ${UNIT_Y_UP} 0 0 1 ${2 * STEP} 0`}
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

  rc.path(
    `M ${rotation(-angle, x, y, -UNIT_X, 0)}
        ${[...Array(coils - 1)]
          .map(
            () =>
              `a ${STEP} ${UNIT_Y_UP} ${angle} 0 ${
                element.mirror ? "0" : "1"
              } ${rotation(-angle, 0, 0, 2 * STEP, 0)}
              a ${OTHER} ${UNIT_Y_DOWN} ${angle} 0 ${
                element.mirror ? "0" : "1"
              } ${rotation(-angle, 0, 0, -2 * OTHER, 0)} `
          )
          .join("")}
          a ${STEP} ${UNIT_Y_UP} ${angle} 0 ${
      element.mirror ? "0" : "1"
    } ${rotation(-angle, 0, 0, 2 * STEP, 0)}`
  );
};

export const drawer = (element) => {
  return `to[L${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(L);
