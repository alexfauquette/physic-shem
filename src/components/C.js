import React from "react";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const height = 0.6;
const width = 0.2;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

export const getAnchor = ({ fromCoords, toCoords }) => {
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const angle = Math.atan2(yTo - yFrom, xTo - xFrom);

  const x = (xFrom + xTo) / 2 + 55 * Math.sin(angle);
  const y = (yFrom + yTo) / 2 - 55 * Math.cos(angle);
  return [{ name: "wiper", x, y }];
};

const C = () => (
  <>
    <path d={`M  ${-UNIT_X} ${-UNIT_Y} L ${-UNIT_X} ${UNIT_Y}`} />
    <path d={`M  ${UNIT_X} ${-UNIT_Y} L ${UNIT_X} ${UNIT_Y}`} />
  </>
);

export const drawer = (element) => {
  return `to[C${getPathAttributes(element)}] `;
};

export default withPathAttributes({ width, height })(C);
