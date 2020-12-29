import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "./constantes";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";

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

export const roughComponent = (rc, x0, y0, element) => {
  const { x, y, angle } = drawLinks(rc, x0, y0, width, height, element);

  rc.path(
    `M ${rotation(-angle, x, y, r, r)}
    L ${rotation(-angle, x, y, -r, -r)}
    M ${rotation(-angle, x, y, r, -r)}
    L ${rotation(-angle, x, y, -r, r)}
    `
  );
  rc.circle(x, y, 2 * R);
};

export const drawer = (element) => {
  return `to[lamp${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(Lampe);
