import React from "react";
import "./style.scss";
import {
  MULTIPLICATIVE_CONST,
  R_LEN,
  default_path_options,
  rotation,
} from "utils";
import {
  withPathAttributes,
  getPathAttributes,
  drawLinks,
} from "./hoc/pathComponents";
import ArrowEnd, { drawRoughArrowEnd } from "atoms/arrowEnd";

import { drawRoughCurrant } from "atoms/currant";

const height = 0.35;
const width = 0.35;

const Arrow = ({ x, y, r, theta1, theta2 }) => {
  const x1 = x + r * Math.cos((theta1 / 180) * Math.PI);
  const y1 = y - r * Math.sin((theta1 / 180) * Math.PI);

  const x2 = x + r * Math.cos((theta2 / 180) * Math.PI);
  const y2 = y - r * Math.sin((theta2 / 180) * Math.PI);

  return (
    <>
      <path
        d={`M ${x1} ${y1} A ${r} ${r} 0 0 ${
          theta1 < theta2 ? 0 : 1
        } ${x2} ${y2} `}
      />
      <ArrowEnd x={x2} y={y2} angle={theta1 < theta2 ? 194 : 96} />
    </>
  );
};

export const getBoundingBox = ({ withArrow = true }) => {
  const height = withArrow ? 0.35 : 0.3;

  const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
  const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;
  return {
    dx1: -UNIT_X,
    dx2: UNIT_X,
    dy1: -UNIT_Y,
    dy2: 0,
  };
};

const Switch = ({ isOpen = true, withArrow = true }) => {
  const height = withArrow ? 0.35 : 0.3;

  const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
  const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;
  if (withArrow) {
    return (
      <>
        <Arrow
          x={-UNIT_X}
          y={0}
          r={1.2 * UNIT_X}
          theta1={isOpen ? -10 : 90}
          theta2={isOpen ? 90 : -20}
        />
        <path d={`M ${-UNIT_X} 0 L ${0.6 * UNIT_X} ${-UNIT_Y}`} />
      </>
    );
  }

  return (
    <path
      d={`M ${-UNIT_X} 0 L ${0.9 * UNIT_X} ${-UNIT_Y} ${
        isOpen
          ? ""
          : `M ${UNIT_X} 0 L ${0.2 * UNIT_X} 0 L ${0.2 * UNIT_X} ${-UNIT_Y}`
      }`}
    />
  );
};

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const { isOpen, withArrow } = element;
  const height = withArrow ? 0.35 : 0.3;

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

  const xScale = element.invert ? -1 : 1;
  const yScale = element.mirror ? -1 : 1;

  const useNaiveCircleOrientation =
    (element.invert && element.mirror) || (!element.invert && !element.mirror);

  const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
  const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

  if (!withArrow) {
    rc.path(
      `M ${rotation(-angle, x, y, -UNIT_X, 0, xScale, yScale)}
        L ${rotation(-angle, x, y, 0.9 * UNIT_X, -UNIT_Y, xScale, yScale)}`
    );
    if (!isOpen) {
      rc.path(
        `M ${rotation(-angle, x, y, UNIT_X, 0, xScale, yScale)}
          L ${rotation(-angle, x, y, 0.2 * UNIT_X, 0, xScale, yScale)} 
          L ${rotation(-angle, x, y, 0.2 * UNIT_X, -UNIT_Y, xScale, yScale)}`
      );
    }
  } else {
    rc.path(
      `M ${rotation(-angle, x, y, -UNIT_X, 0, xScale, yScale)}
        L ${rotation(-angle, x, y, 0.6 * UNIT_X, -UNIT_Y, xScale, yScale)}`
    );

    const cx = -UNIT_X;
    const r = 1.2 * UNIT_X;
    const theta1 = isOpen ? -10 : 90;
    const theta2 = isOpen ? 90 : -20;

    const x1 = cx + r * Math.cos((theta1 / 180) * Math.PI);
    const y1 = -r * Math.sin((theta1 / 180) * Math.PI);

    const x2 = cx + r * Math.cos((theta2 / 180) * Math.PI);
    const y2 = -r * Math.sin((theta2 / 180) * Math.PI);

    rc.path(
      `M ${rotation(-angle, x, y, x1, y1, xScale, yScale)} A ${r} ${r} 1 0 ${
        theta1 < theta2
          ? useNaiveCircleOrientation
            ? 0
            : 1
          : useNaiveCircleOrientation
          ? 1
          : 0
      } ${rotation(-angle, x, y, x2, y2, xScale, yScale)}`
    );

    const xEnd =
      x +
      Math.cos((angle / 180) * Math.PI) * xScale * x2 -
      Math.sin((angle / 180) * Math.PI) * yScale * y2;

    const yEnd =
      y +
      Math.sin((angle / 180) * Math.PI) * xScale * x2 +
      Math.cos((angle / 180) * Math.PI) * yScale * y2;

    drawRoughArrowEnd(
      rc,
      xEnd,
      yEnd,
      -angle -
        (theta1 < theta2
          ? useNaiveCircleOrientation
            ? 194
            : 170
          : useNaiveCircleOrientation
          ? 96
          : 70),
      xScale,
      yScale
    );
  }
};

export const drawer = (element) => {
  const { isOpen, withArrow } = element;
  if (withArrow) {
    return `to[${isOpen ? "opening " : ""}switch${getPathAttributes(
      element
    )}] `;
  }
  return `to[normal ${isOpen ? "open" : "closed"} switch${getPathAttributes(
    element
  )}] `;
};

export const parameters = {
  ...default_path_options,
  isOpen: true,
  withArrow: true,
};

export default withPathAttributes({ width, height })(Switch);
