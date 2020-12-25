import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const height = 0.8;
const height_2 = 0.3;
const width = 0.8;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y2 = 0.5 * height_2 * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

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

const PR = ({ wiper_pos = 0.5 }) => {
  return (
    <>
      <path
        d={`M ${(-6 / 6) * UNIT_X} 0 L ${(-5 / 6) * UNIT_X} ${-UNIT_Y2} L ${
          (-3 / 6) * UNIT_X
        } ${UNIT_Y2} L ${(-1 / 6) * UNIT_X} ${-UNIT_Y2} L ${
          (1 / 6) * UNIT_X
        } ${UNIT_Y2} L ${(3 / 6) * UNIT_X} ${-UNIT_Y2} L ${
          (5 / 6) * UNIT_X
        } ${UNIT_Y2} L ${(6 / 6) * UNIT_X} 0`}
      />
      <path
        d={`M ${-(0.5 - wiper_pos) * 2 * UNIT_X} ${-UNIT_Y} L ${
          -(0.5 - wiper_pos) * 2 * UNIT_X
        } ${-UNIT_Y2}`}
      />
    </>
  );
};

export const drawer = (element) => {
  return `to[pR${getPathAttributes(element)}] `;
};

export default connect(mapStateToProps)(
  withPathAttributes({ width, height })(PR)
);
