import React from "react";
import { translateSVGbaseline2Canvas, translateSVGalign2Canvas } from "utils";

export const getTextAnchor = (angle, isAbove, x, y) => {
  if (-20 < angle && angle < 20) {
    return {
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "baseline" : "hanging",
    };
  }
  if (-110 < angle && angle < -70) {
    return {
      textAnchor: isAbove ? "end" : "start",
      alignmentBaseline: "middle",
    };
  }
  if (70 < angle && angle < 110) {
    return {
      textAnchor: isAbove ? "start" : "end",
      alignmentBaseline: "middle",
    };
  }
  if (angle < -160 || angle > 160) {
    return {
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "hanging" : "baseline",
    };
  }
  if (angle <= -20 && angle >= -70) {
    return {
      // textAnchor: isAbove ? "end" : "start",
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "baseline" : "hanging",
      transform: `rotate(${angle}deg)`,
      transformOrigin: `${x}px ${y}px`,
      rotationAngle: angle,
    };
  }
  if (angle >= 20 && angle <= 70) {
    return {
      // textAnchor: isAbove ? "start" : "end",
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "baseline" : "hanging",
      transform: `rotate(${angle}deg)`,
      transformOrigin: `${x}px ${y}px`,
      rotationAngle: angle,
    };
  }
  if (angle <= -110 && angle >= -160) {
    return {
      // textAnchor: isAbove ? "end" : "start",
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "hanging" : "baseline",
      transform: `rotate(${angle + 180}deg)`,
      transformOrigin: `${x}px ${y}px`,
      rotationAngle: angle + 180,
    };
  }
  if (angle >= 110 && angle <= 160) {
    return {
      // textAnchor: isAbove ? "start" : "end",
      textAnchor: "middle",
      alignmentBaseline: isAbove ? "hanging" : "baseline",
      transform: `rotate(${angle + 180}deg)`,
      transformOrigin: `${x}px ${y}px`,
      rotationAngle: angle + 180,
    };
  }
};

export const getLabelAttribute = (text, isAbove = true) => {
  if (!text) {
    return "";
  }
  if (!isAbove) {
    return `l_=${text}`;
  } else {
    return `l=${text}`;
  }
};
export const getAnnotationAttribute = (text, isAbove = false) => {
  if (!text) {
    return "";
  }
  if (!isAbove) {
    return `a=${text}`;
  } else {
    return `a^=${text}`;
  }
};

const gap = 10;

const Label = ({
  fromCoords,
  toCoords,
  angle = null,
  height = null,
  text,
  isAbove = true,
}) => {
  if (!fromCoords || !toCoords || !text || angle === null || height === null) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const xL =
    (xFrom + xTo) / 2 +
    (isAbove ? height + gap : -(height + gap)) *
      Math.sin((angle / 180) * Math.PI);
  const yL =
    (yFrom + yTo) / 2 +
    (isAbove ? -(height + gap) : height + gap) *
      Math.cos((angle / 180) * Math.PI);

  return (
    <g
      style={{
        fill: "black",
        stroke: "none",
      }}
    >
      <text
        key={Math.random()}
        x={xL}
        y={yL}
        style={{ ...getTextAnchor(angle, isAbove, xL, yL) }}
      >
        {text}
      </text>
    </g>
  );
};

export const drawRoughLabel = ({
  ctx,
  text,
  from,
  to,
  angle,
  isAbove,
  height,
}) => {
  const { x: xFrom, y: yFrom } = from;
  const { x: xTo, y: yTo } = to;

  const xL =
    (xFrom + xTo) / 2 +
    (isAbove ? height + gap : -(height + gap)) *
      Math.sin((angle / 180) * Math.PI);
  const yL =
    (yFrom + yTo) / 2 +
    (isAbove ? -(height + gap) : height + gap) *
      Math.cos((angle / 180) * Math.PI);

  const { textAnchor, alignmentBaseline, rotationAngle = 0 } = getTextAnchor(
    angle,
    isAbove,
    0,
    0
  );

  ctx.save();

  ctx.textAlign = translateSVGalign2Canvas[textAnchor];
  ctx.textBaseline = translateSVGbaseline2Canvas[alignmentBaseline];

  ctx.translate(xL, yL);
  ctx.rotate((rotationAngle * Math.PI) / 180);

  ctx.fillText(text, 0, 0);

  ctx.restore();
};
export default Label;
