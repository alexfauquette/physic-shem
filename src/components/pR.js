import React from "react";
import "./style.scss";
import {
  MULTIPLICATIVE_CONST,
  R_LEN,
  rotation,
  default_path_options,
} from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const height = 0.8;
const height_2 = 0.3;
const width = 0.8;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y2 = 0.5 * height_2 * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

export const getBoundingBox = () => ({
  dx1: -UNIT_X,
  dx2: UNIT_X,
  dy1: -UNIT_Y,
  dy2: UNIT_Y2,
});

export const getAnchor = ({ fromCoords, toCoords }) => {
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const angle = Math.atan2(yTo - yFrom, xTo - xFrom);

  const x = (xFrom + xTo) / 2 + 55 * Math.sin(angle);
  const y = (yFrom + yTo) / 2 - 55 * Math.cos(angle);
  return [{ name: "wiper", x, y }];
};

const PR = ({ wiper_pos = 0.5 }) => (
  <>
    <path
      d={`M ${(-6 / 6) * UNIT_X} 0 L ${(-5 / 6) * UNIT_X} ${-UNIT_Y2} L ${
        (-3 / 6) * UNIT_X
      } ${UNIT_Y2} L ${(-1 / 6) * UNIT_X} ${-UNIT_Y2} L ${
        (1 / 6) * UNIT_X
      } ${UNIT_Y2} L ${(3 / 6) * UNIT_X} ${-UNIT_Y2} L ${
        (5 / 6) * UNIT_X
      } ${UNIT_Y2} L ${(6 / 6) * UNIT_X} 0`}
    />
    <path
      d={`M ${-(0.5 - wiper_pos) * 2 * UNIT_X} ${-UNIT_Y} L ${
        -(0.5 - wiper_pos) * 2 * UNIT_X
      } ${-UNIT_Y2}`}
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

  const { wiper_pos } = element;
  rc.path(
    `M ${rotation(-angle, x, y, -UNIT_X, 0)}
    L ${rotation(-angle, x, y, (-5 / 6) * UNIT_X, -UNIT_Y2)} 
    L ${rotation(-angle, x, y, (-3 / 6) * UNIT_X, UNIT_Y2)} 
    L ${rotation(-angle, x, y, (-1 / 6) * UNIT_X, -UNIT_Y2)} 
    L ${rotation(-angle, x, y, (1 / 6) * UNIT_X, UNIT_Y2)} 
    L ${rotation(-angle, x, y, (3 / 6) * UNIT_X, -UNIT_Y2)} 
    L ${rotation(-angle, x, y, (5 / 6) * UNIT_X, UNIT_Y2)} 
    L ${rotation(-angle, x, y, UNIT_X, 0)}
    M ${rotation(-angle, x, y, -(0.5 - wiper_pos) * 2 * UNIT_X, -UNIT_Y)}
    L ${rotation(-angle, x, y, -(0.5 - wiper_pos) * 2 * UNIT_X, -UNIT_Y2)}`
  );
};

export const drawer = (element) => {
  return `to[pR${getPathAttributes(element)}] `;
};

export const parameters = {
  ...default_path_options,
  wiper_pos: 0.5,
};

export default withPathAttributes({ width, height })(PR);
