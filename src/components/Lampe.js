import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import CurrantArrow from "../atoms/currant";

const R = 0.6 * 0.5 * MULTIPLICATIVE_CONST;
const r = (0.7071 * R).toFixed(3);

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

const mapDispatchToProps = (dispatch) => {
  return {};
};

const Lampe = ({
  fromCoords,
  toCoords,
  anchors,
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
  const ratio = 1 / 2 - R / d;
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
        <circle cx={0} cy={0} r={R} />
        <path d={`M -${r} -${r} L ${r} ${r} M -${r} ${r} L ${r} -${r}`} />
      </g>
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

export const drawer = (element, from, to) =>
  `\\draw (${((from.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}, ${(
    (-from.y / MULTIPLICATIVE_CONST) *
    R_LEN
  ).toFixed(2)}) to[lamp] (${((to.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(
    2
  )}, ${((-to.y / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)});`;

export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
