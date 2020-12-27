import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const height = 0.6;
const width = 0.5;
const capacitor_width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

const STEP = capacitor_width * UNIT_X;

const Vcapacitor = () => (
  <>
    <path d={`M  ${-STEP} ${-UNIT_Y} L ${-STEP} ${UNIT_Y}`} />
    <path d={`M  ${STEP} ${-UNIT_Y} L ${STEP} ${UNIT_Y}`} />
    <path d={`M ${-UNIT_X} ${-UNIT_Y} L ${UNIT_X} ${UNIT_Y}`} />
  </>
);

export const drawer = (element) => {
  return `to[variable capacitor${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width: capacitor_width / 2, height })(
  Vcapacitor
);
