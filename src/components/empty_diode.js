import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";

const height = 0.5;
const width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST;

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id
    ? {
        mode: state.mode,
        // allows to create components directly without using the store
        fromCoords: state.anchors.byId[props.from],
        toCoords: state.anchors.byId[props.to],
      }
    : {};
};

const EmptyDiode = ({
  fromCoords,
  toCoords,
  anchors,
  mode,
  selected,
  showHandles,
  id,
  ...props
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
  const ratio = (d - width * MULTIPLICATIVE_CONST) / (2 * d); // ratio of the line use by connection
  const angle = parseInt(
    (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
  );
  return (
    <g className={`component ${selected ? "red" : "black"}`}>
      <g {...props}>
        <g
          style={{
            transform: `translate(${(xFrom + xTo) / 2}px , ${
              (yFrom + yTo) / 2
            }px) rotate(${angle}deg)`,
          }}
        >
          <path
            d={`M ${UNIT_X} 0 L ${-UNIT_X} ${-UNIT_Y} L ${-UNIT_X} ${UNIT_Y} Z`}
          />
          <path d={`M ${UNIT_X} ${UNIT_Y} L ${UNIT_X} ${-UNIT_Y}`} />
        </g>

        {/* here start the connection between dipole and anchors */}
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
      </g>
    </g>
  );
};

export const drawer = (element, from, to) =>
  `\\draw (${((from.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}, ${(
    (-from.y / MULTIPLICATIVE_CONST) *
    R_LEN
  ).toFixed(2)}) to[empty diode] (${(
    (to.x / MULTIPLICATIVE_CONST) *
    R_LEN
  ).toFixed(2)}, ${((-to.y / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)});`;

export default connect(mapStateToProps)(EmptyDiode);
