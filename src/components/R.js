import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

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

export const drawer = (element) => {
  return `to[R${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(R);
