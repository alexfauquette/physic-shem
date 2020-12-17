import React from "react";

const getTextAnchor = (angle, currantIsAbove) => {
  if (-5 < angle && angle < 5) {
    return {
      textAnchor: "middle",
      alignmentBaseline: currantIsAbove ? "baseline" : "hanging",
    };
  }
  if (-86 < angle && angle <= -5) {
    return {
      textAnchor: currantIsAbove ? "end" : "start",
      alignmentBaseline: currantIsAbove ? "baseline" : "hanging",
    };
  }
  if (-95 < angle && angle <= -86) {
    return {
      textAnchor: currantIsAbove ? "end" : "start",
      alignmentBaseline: "middle",
    };
  }
  if (-176 < angle && angle <= -95) {
    return {
      textAnchor: currantIsAbove ? "end" : "start",
      alignmentBaseline: currantIsAbove ? "hanging" : "baseline",
    };
  }

  if (angle >= 5 && angle < 86) {
    return {
      textAnchor: currantIsAbove ? "start" : "end",
      alignmentBaseline: currantIsAbove ? "baseline" : "hanging",
    };
  }
  if (angle >= 86 && angle < 95) {
    return {
      textAnchor: currantIsAbove ? "start" : "end",
      alignmentBaseline: "middle",
    };
  }
  if (angle >= 95 && angle < 176) {
    return {
      textAnchor: currantIsAbove ? "start" : "end",
      alignmentBaseline: currantIsAbove ? "hanging" : "baseline",
    };
  }
  return {
    textAnchor: "middle",
    alignmentBaseline: currantIsAbove ? "hanging" : "baseline",
  };
};

export const getCurrantAttribute = ({
  show,
  currantText,
  currantIsForward,
  currantIsAbove,
  currantIsAfter,
}) => {
  if (!show) {
    return "";
  }
  const text = currantText || "$$$$";
  if (!currantIsAfter) {
    const position = currantIsAbove ? "^" : "_";
    const direction = currantIsForward ? ">" : "<";
    return `i${direction}${position}=${text}`;
  } else {
    const position = currantIsAbove ? "^" : "_";
    const direction = currantIsForward ? ">" : "<";
    return `i${position}${direction}=${text}`;
  }
};

const CurrantArrow = ({
  fromCoords,
  toCoords,
  currantText,
  ratio = null,
  angle = null,
  currantIsForward = true,
  currantIsAbove = true,
  currantIsAfter = true,
}) => {
  if (
    !fromCoords ||
    !toCoords ||
    !currantText ||
    angle === null ||
    ratio === null
  ) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const xI = currantIsAfter
    ? xTo + (ratio * (xFrom - xTo)) / 2
    : xFrom + (ratio * (xTo - xFrom)) / 2;
  const yI = currantIsAfter
    ? yTo + (ratio * (yFrom - yTo)) / 2
    : yFrom + (ratio * (yTo - yFrom)) / 2;
  const rI = 15;

  return (
    <g
      style={{
        fill: "black",
        stroke: "none",
      }}
    >
      <path
        d={`M ${xI + 0.5 * rI} ${yI} L  ${xI - 0.5 * rI} ${yI + 0.5 * rI} L  ${
          xI - 0.5 * rI
        } ${yI - 0.5 * rI} Z`}
        style={{
          transform: `rotate(${angle + (currantIsForward ? 0 : 180)}deg)`,
          transformOrigin: `${xI}px ${yI}px`,
        }}
      />
      <text
        x={
          xI -
          (currantIsAbove ? -0.5 * rI : 0.5 * rI) *
            Math.sin((angle / 180) * Math.PI)
        }
        y={
          yI +
          (currantIsAbove ? -0.5 * rI : 0.5 * rI) *
            Math.cos((angle / 180) * Math.PI)
        }
        style={{ ...getTextAnchor(angle, currantIsAbove) }}
      >
        {currantText}
      </text>
    </g>
  );
};

export default CurrantArrow;
