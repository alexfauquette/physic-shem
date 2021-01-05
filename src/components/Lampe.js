import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const width = 0.6;
const height = 0.6;
const R = 0.6 * 0.5 * MULTIPLICATIVE_CONST * R_LEN;
const r = (0.7071 * R).toFixed(3);

export const getBoundingBox = () => ({
  dx1: -R,
  dx2: R,
  dy1: -R,
  dy2: R,
});

const Lampe = () => (
  <>
    <circle cx={0} cy={0} r={R} />
    <path d={`M -${r} -${r} L ${r} ${r} M -${r} ${r} L ${r} -${r}`} />
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
