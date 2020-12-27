import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

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

export const drawer = (element) => {
  return `to[battery1${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(Battery1);
