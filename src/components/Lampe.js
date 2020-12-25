import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const width = 0.6;
const height = 0.6;
const R = 0.6 * 0.5 * MULTIPLICATIVE_CONST * R_LEN;
const r = (0.7071 * R).toFixed(3);

const Lampe = () => (
  <>
    <circle cx={0} cy={0} r={R} />
    <path d={`M -${r} -${r} L ${r} ${r} M -${r} ${r} L ${r} -${r}`} />
  </>
);

export const drawer = (element) => {
  return `to[lamp${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(Lampe);
