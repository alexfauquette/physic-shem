import React from "react";
import { connect } from "react-redux";
import { MULTIPLICATIVE_CONST, R_LEN } from "../constantes";
import CurrantArrow, { getCurrantAttribute } from "../../atoms/currant";
import Label, {
  getLabelAttribute,
  getAnnotationAttribute,
  drawRoughLabel,
} from "../../atoms/label";

const mapStateToProps = (state, props) => {
  return props.id
    ? {
        fromCoords: state.coordinates.byId[props.from],
        toCoords: state.coordinates.byId[props.to],
      }
    : {};
};

// TODO : should allow to have heighTop and heighBottom (cf pR component problem)
// or a ratio between top and bottom to share the complete heigh
export const withPathAttributes = ({ height = 1, width = 1 }) => (component) =>
  connect(mapStateToProps)((props) => {
    const {
      fromCoords,
      toCoords,
      selected,
      onMouseDown,
      currant,
      label,
      annotation,
      mirror,
      invert,
    } = props;

    if (!fromCoords || !toCoords) {
      return null;
    }

    const { x: xFrom, y: yFrom } = fromCoords;
    const { x: xTo, y: yTo } = toCoords;

    const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
    const ratio = (d - width * MULTIPLICATIVE_CONST * R_LEN) / (2 * d); // ratio of the line use by connection
    const angle = parseInt(
      (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
    );

    return (
      <g
        onMouseDown={onMouseDown || null}
        className={`component ${selected ? "red" : "black"}`}
      >
        <g
          style={{
            transform: `translate(${(xFrom + xTo) / 2}px , ${
              (yFrom + yTo) / 2
            }px) rotate(${angle}deg)${mirror ? "scaleY(-1)" : ""}${
              invert ? "scaleX(-1)" : ""
            }`,
          }}
        >
          {component({
            ...props,
            x: (xFrom + xTo) / 2,
            y: (yFrom + yTo) / 2,
            angle: angle,
          })}
        </g>

        {/* draw the line between anchors and the component */}
        <path
          d={`M ${xFrom} ${yFrom} L ${xFrom + ratio * (xTo - xFrom)} ${
            yFrom + ratio * (yTo - yFrom)
          }`}
        />
        <path
          d={`M ${xTo} ${yTo} L ${xTo + ratio * (xFrom - xTo)} ${
            yTo + ratio * (yFrom - yTo)
          }`}
        />

        {currant && currant.show && (
          <CurrantArrow
            fromCoords={fromCoords}
            toCoords={toCoords}
            ratio={ratio}
            angle={angle}
            {...currant}
          />
        )}
        {label && (
          <Label
            fromCoords={fromCoords}
            toCoords={toCoords}
            height={0.5 * height * MULTIPLICATIVE_CONST * R_LEN}
            angle={angle}
            text={label}
          />
        )}
        {annotation && (
          <Label
            fromCoords={fromCoords}
            toCoords={toCoords}
            height={0.5 * height * MULTIPLICATIVE_CONST * R_LEN}
            angle={angle}
            text={annotation}
            isAbove={false}
          />
        )}
      </g>
    );
  });

export const drawLinks = (rc, ctx, x0, y0, width, height, element) => {
  const { x: xFrom, y: yFrom } = element.fromCoords;
  const { x: xTo, y: yTo } = element.toCoords;

  const x = (xFrom + xTo) / 2 - x0;
  const y = (yFrom + yTo) / 2 - y0;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
  const ratio = (d - width * MULTIPLICATIVE_CONST * R_LEN) / (2 * d); // ratio of the line use by connection
  const angle = parseInt(
    (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
  );

  rc.path(
    `M ${xFrom - x0} ${yFrom - y0}
    L ${xFrom + ratio * (xTo - xFrom) - x0} ${
      yFrom + ratio * (yTo - yFrom) - y0
    }
    M ${xTo - x0} ${yTo - y0}
    L ${xTo + ratio * (xFrom - xTo) - x0} ${yTo + ratio * (yFrom - yTo) - y0}`
  );

  const { label = null, annotation = null } = element;

  if (label !== null) {
    drawRoughLabel({
      ctx,
      text: label,
      from: { x: xFrom - x0, y: yFrom - y0 },
      to: { x: xTo - x0, y: yTo - y0 },
      angle,
      isAbove: true,
      height: 0.5 * height * MULTIPLICATIVE_CONST * R_LEN,
    });
  }
  if (annotation !== null) {
    drawRoughLabel({
      ctx,
      text: annotation,
      from: { x: xFrom - x0, y: yFrom - y0 },
      to: { x: xTo - x0, y: yTo - y0 },
      angle,
      isAbove: false,
      height: 0.5 * height * MULTIPLICATIVE_CONST * R_LEN,
    });
  }

  return { x, y, angle, ratio };
};

export const getPathAttributes = (element) => {
  const currantAttribute = getCurrantAttribute(element.currant);
  const label = getLabelAttribute(element.label);
  const annotation = getAnnotationAttribute(element.annotation);

  return `${label ? `, ${label}` : ""}${annotation ? `, ${annotation}` : ""}${
    currantAttribute ? `, ${currantAttribute}` : ""
  }${element.mirror ? ", mirror" : ""}${element.invert ? ", invert" : ""}`;
};
