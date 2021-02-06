import React from "react";
import { translateSVGbaseline2Canvas, translateSVGalign2Canvas } from "utils";
import { getTextAnchor } from "./label";
import ArrowEnd, { drawRoughArrowEnd } from "./arrowEnd";

const bump = 1.5;

const Tension = ({
  fromCoords,
  toCoords,
  angle = null,
  height = null,
  text,
  isAbove = true,
  isDirect = true,
}) => {
  if (!fromCoords || !toCoords || !text || angle === null || height === null) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const xM = (xFrom + xTo) / 2;
  const yM = (yFrom + yTo) / 2;

  const xArrow1 =
    xM -
    bump * height * Math.cos(((angle + (isAbove ? 60 : -60)) / 180) * Math.PI);
  const yArrow1 =
    yM -
    bump * height * Math.sin(((angle + (isAbove ? 60 : -60)) / 180) * Math.PI);

  const xArrow2 =
    xM -
    bump *
      height *
      Math.cos(((angle + (isAbove ? 120 : -120)) / 180) * Math.PI);
  const yArrow2 =
    yM -
    bump *
      height *
      Math.sin(((angle + (isAbove ? 120 : -120)) / 180) * Math.PI);

  const xArrow_m =
    xM -
    bump * height * Math.cos(((angle + (isAbove ? 90 : -90)) / 180) * Math.PI);
  const yArrow_m =
    yM -
    bump * height * Math.sin(((angle + (isAbove ? 90 : -90)) / 180) * Math.PI);

  return (
    <>
      <text
        key={Math.random()}
        x={xArrow_m}
        y={yArrow_m}
        style={{
          fill: "black",
          stroke: "none",
          ...getTextAnchor(angle, isAbove, xArrow_m, yArrow_m),
        }}
      >
        {text}
      </text>
      <path d={`M ${xArrow1} ${yArrow1} L ${xArrow2} ${yArrow2} `} />
      <ArrowEnd
        x={isDirect ? xArrow2 : xArrow1}
        y={isDirect ? yArrow2 : yArrow1}
        angle={isDirect ? angle : 180 + angle}
      />
    </>
  );
};

export const drawRoughTension = ({
  ctx,
  rc,
  text,
  from,
  to,
  angle,
  isAbove,
  isDirect,
  height,
}) => {
  if (!text) {
    return null;
  }

  const { x: xFrom, y: yFrom } = from;
  const { x: xTo, y: yTo } = to;

  const xM = (xFrom + xTo) / 2;
  const yM = (yFrom + yTo) / 2;

  const xArrow1 =
    xM -
    bump * height * Math.cos(((angle + (isAbove ? 60 : -60)) / 180) * Math.PI);
  const yArrow1 =
    yM -
    bump * height * Math.sin(((angle + (isAbove ? 60 : -60)) / 180) * Math.PI);

  const xArrow2 =
    xM -
    bump *
      height *
      Math.cos(((angle + (isAbove ? 120 : -120)) / 180) * Math.PI);
  const yArrow2 =
    yM -
    bump *
      height *
      Math.sin(((angle + (isAbove ? 120 : -120)) / 180) * Math.PI);

  const xArrow_m =
    xM -
    bump * height * Math.cos(((angle + (isAbove ? 90 : -90)) / 180) * Math.PI);
  const yArrow_m =
    yM -
    bump * height * Math.sin(((angle + (isAbove ? 90 : -90)) / 180) * Math.PI);

  const { textAnchor, alignmentBaseline, rotationAngle = 0 } = getTextAnchor(
    angle,
    isAbove,
    0,
    0
  );

  ctx.save();

  ctx.textAlign = translateSVGalign2Canvas[textAnchor];
  ctx.textBaseline = translateSVGbaseline2Canvas[alignmentBaseline];

  ctx.translate(xArrow_m, yArrow_m);
  ctx.rotate((rotationAngle * Math.PI) / 180);

  ctx.fillText(text, 0, 0);

  ctx.restore();

  rc.path(`M ${xArrow1} ${yArrow1} L ${xArrow2} ${yArrow2}`);

  drawRoughArrowEnd(
    rc,
    isDirect ? xArrow2 : xArrow1,
    isDirect ? yArrow2 : yArrow1,
    isDirect ? -angle : 180 - angle
  );
};

export const getVoltageAttribute = ({
  voltageName,
  voltageIsDown,
  voltageIsDirect,
}) => {
  if (!voltageName) {
    return "";
  }
  if (voltageIsDown && voltageIsDirect) {
    return `v_=${voltageName}`;
  }
  if (voltageIsDown && !voltageIsDirect) {
    return `v_<=${voltageName}`;
  }
  if (!voltageIsDown && !voltageIsDirect) {
    return `v<=${voltageName}`;
  }
  return `v=${voltageName}`;
};
export default Tension;
