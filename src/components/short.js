import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import CurrantArrow from "../atoms/currant";
import Label from "../atoms/label";

import { drawRoughCurrant } from "../atoms/currant";
import { getPathAttributes } from "./hoc/pathComponents";

const mapStateToProps = (state, props) => {
  return props.id
    ? {
        fromCoords: state.anchors.byId[props.from],
        toCoords: state.anchors.byId[props.to],
      }
    : {};
};

const Short = ({
  fromCoords,
  toCoords,
  selected,
  onMouseDown,
  currant,
  label,
  annotation,
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }

  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
  const ratio = 1; // ratio of the line use by connection
  const angle = parseInt(
    (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
  );

  return (
    <g
      onMouseDown={onMouseDown || null}
      className={`component ${selected ? "red" : "black"}`}
    >
      <path d={`M ${xFrom} ${yFrom} L ${xTo} ${yTo}`} />

      {currant && currant.show && (
        <CurrantArrow
          fromCoords={fromCoords}
          toCoords={toCoords}
          ratio={1}
          angle={angle}
          {...currant}
        />
      )}
      {label && (
        <Label
          fromCoords={fromCoords}
          toCoords={toCoords}
          height={0}
          angle={angle}
          text={label}
        />
      )}
      {annotation && (
        <Label
          fromCoords={fromCoords}
          toCoords={toCoords}
          height={0}
          angle={angle}
          text={annotation}
          isAbove={false}
        />
      )}
    </g>
  );
};

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const xFrom = element.fromCoords.x - x0;
  const yFrom = element.fromCoords.y - y0;

  const xTo = element.toCoords.x - x0;
  const yTo = element.toCoords.y - y0;

  rc.path(`M ${xFrom} ${yFrom} L ${xTo} ${yTo}`);

  const angle = parseInt(
    (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
  );

  drawRoughCurrant(rc, ctx, x0, y0, angle, 1, element);
};

export const drawer = (element) => {
  return `to[short${getPathAttributes(element)}] `;
};

export default connect(mapStateToProps)(Short);
