import React from "react";
import "../style.scss";
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
} from "../hoc/pathComponents";
import { drawRoughCurrant } from "atoms/currant";

const SOURCE_HEIGHT = 0.6;
const SOURCE_WIDTH = 0.6;

// const OO_SOURCE_HEIGHT = 0.6;
// const OO_SOURCE_WIDTH = 0.6;

const UNIT_X = 0.5 * SOURCE_WIDTH * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * SOURCE_HEIGHT * MULTIPLICATIVE_CONST * R_LEN;

// sum must be equal to 1
const OO_SOURCE_CIRCLE_SIZE = 0.65;
const OO_SOURCE_CIRCLE_OFFSET = 0.35;

const O_Source = (type = "v") => () => (
  <>
    <circle cx={0} cy={0} r={UNIT_X} />
    {type === "v" ? (
      <path d={`M -${UNIT_X} 0 L ${UNIT_X} 0`} />
    ) : (
      <path d={`M 0 ${UNIT_X} L 0 -${UNIT_X}`} />
    )}
  </>
);

const OO_Source = () => (
  <>
    <circle
      cx={-OO_SOURCE_CIRCLE_OFFSET * UNIT_X}
      cy={0}
      r={OO_SOURCE_CIRCLE_SIZE * UNIT_X}
    />
    <circle
      cx={OO_SOURCE_CIRCLE_OFFSET * UNIT_X}
      cy={0}
      r={OO_SOURCE_CIRCLE_SIZE * UNIT_X}
    />
  </>
);

export const V_SourceComponent = withPathAttributes({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
  isVoltageSource: true,
})(O_Source("v"));
export const I_SourceComponent = withPathAttributes({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
  isVoltageSource: true,
})(O_Source("i"));
export const V_OO_SourceComponent = withPathAttributes({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
  isVoltageSource: true,
})(OO_Source);
export const I_OO_SourceComponent = withPathAttributes({
  width: SOURCE_WIDTH,
  height: SOURCE_HEIGHT,
})(OO_Source);

export const getBoundingBox = () => ({
  dx1: -UNIT_X,
  dx2: UNIT_X,
  dy1: -UNIT_Y,
  dy2: UNIT_Y,
});

export const roughComponent = (type) => (rc, ctx, x0, y0, element) => {
  const { x, y, angle, ratio } = drawLinks(
    rc,
    ctx,
    x0,
    y0,
    SOURCE_WIDTH,
    SOURCE_HEIGHT,
    element
  );

  drawRoughCurrant(rc, ctx, x0, y0, angle, ratio, element);

  if (type === "vsource") {
    rc.circle(x, y, 2 * UNIT_X);
    rc.path(
      `M ${rotation(-angle, x, y, -UNIT_X, 0)}
      L ${rotation(-angle, x, y, UNIT_X, 0)}`
    );
  }
  if (type === "isource") {
    rc.circle(x, y, 2 * UNIT_X);
    rc.path(
      `M ${rotation(-angle, x, y, 0, -UNIT_X)}
      L ${rotation(-angle, x, y, 0, UNIT_X)}`
    );
  }
  if (type === "ioosource" || type === "voosource") {
    const x1 =
      x + Math.cos((Math.PI * angle) / 180) * OO_SOURCE_CIRCLE_OFFSET * UNIT_X;
    const y1 =
      y + Math.sin((Math.PI * angle) / 180) * OO_SOURCE_CIRCLE_OFFSET * UNIT_X;

    const x2 =
      x - Math.cos((Math.PI * angle) / 180) * OO_SOURCE_CIRCLE_OFFSET * UNIT_X;
    const y2 =
      y - Math.sin((Math.PI * angle) / 180) * OO_SOURCE_CIRCLE_OFFSET * UNIT_X;

    rc.circle(x1, y1, 2 * OO_SOURCE_CIRCLE_SIZE * UNIT_X);
    rc.circle(x2, y2, 2 * OO_SOURCE_CIRCLE_SIZE * UNIT_X);
  }
};

export const drawer = (sourceName) => (element) => {
  if (sourceName === "vsource" || sourceName === "voosource") {
    return `to[${sourceName}${getPathAttributes({
      ...element,
      label: "",
    })}] `;
  }
  return `to[${sourceName}${getPathAttributes({ ...element })}] `;
};

export const parameters = {
  ...default_path_options,
  voltageName: "",
  voltageIsDown: false,
  voltageIsDirect: true,
};
