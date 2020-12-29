import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "./constantes";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "../atoms/currant";

const height = 0.6;
const width = 0.3 * 0.33;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

const Battery1 = () => (
  <>
    <path d={`M ${-UNIT_X} ${-UNIT_Y} L ${-UNIT_X} ${UNIT_Y}`} />
    <path d={`M ${UNIT_X} ${-0.5 * UNIT_Y}L ${UNIT_X} ${0.5 * UNIT_Y}`} />
  </>
);

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const { x, y, angle, ratio } = drawLinks(rc, x0, y0, width, height, element);

  drawRoughCurrant(rc, ctx, x0, y0, angle, ratio, element);
  rc.path(
    `M ${rotation(-angle, x, y, -UNIT_X, -UNIT_Y)}
    L ${rotation(-angle, x, y, -UNIT_X, UNIT_Y)}
    M ${rotation(-angle, x, y, UNIT_X, 0.5 * UNIT_Y)}
    L ${rotation(-angle, x, y, UNIT_X, -0.5 * UNIT_Y)}
    `
  );
};

export const drawer = (element) => {
  return `to[battery1${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(Battery1);
