import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { R_LEN, MULTIPLICATIVE_CONST } from "./constantes";
import CurrantArrow, { getCurrantAttribute } from "../atoms/currant";

const height = 0.6;
const width = 0.5;
const capacitor_width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST;

const STEP = capacitor_width * UNIT_X;

export const getAnchor = ({ fromCoords, toCoords }) => {
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const angle = Math.atan2(yTo - yFrom, xTo - xFrom);

  const x = (xFrom + xTo) / 2 + 55 * Math.sin(angle);
  const y = (yFrom + yTo) / 2 - 55 * Math.cos(angle);
  return [{ name: "wiper", x, y }];
};

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

const Vcapacitor = ({
  fromCoords,
  toCoords,
  mode,
  selected,
  showHandles,
  id,
  onMouseDown,
  currant,
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);

  const ratio = (d - 2 * STEP) / (2 * d); // ratio of the line use by connection
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
          }px) rotate(${angle}deg)`,
        }}
      >
        <path d={`M  ${-STEP} ${-UNIT_Y} L ${-STEP} ${UNIT_Y}`} />

        <path d={`M  ${STEP} ${-UNIT_Y} L ${STEP} ${UNIT_Y}`} />

        <path d={`M ${-UNIT_X} ${-UNIT_Y} L ${UNIT_X} ${UNIT_Y}`} />
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

      {currant && currant.show && (
        <CurrantArrow
          fromCoords={fromCoords}
          toCoords={toCoords}
          ratio={ratio}
          angle={angle}
          {...currant}
        />
      )}
    </g>
  );
};

export const drawer = (element, from, to) => {
  const currantAttribute = getCurrantAttribute(element.currant);

  return `\\draw (${((from.x / MULTIPLICATIVE_CONST) * 1.4).toFixed(2)}, ${(
    (-from.y / MULTIPLICATIVE_CONST) *
    R_LEN
  ).toFixed(2)}) to[variable capacitor${
    currantAttribute ? `, ${currantAttribute}` : ""
  }] (${((to.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}, ${(
    (-to.y / MULTIPLICATIVE_CONST) *
    1.4
  ).toFixed(2)});`;
};

export default connect(mapStateToProps)(Vcapacitor);
