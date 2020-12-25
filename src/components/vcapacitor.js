import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const height = 0.6;
const width = 0.5;
const capacitor_width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

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

const Vcapacitor = ({}) => {
  return (
    <>
      <path d={`M  ${-STEP} ${-UNIT_Y} L ${-STEP} ${UNIT_Y}`} />
      <path d={`M  ${STEP} ${-UNIT_Y} L ${STEP} ${UNIT_Y}`} />
      <path d={`M ${-UNIT_X} ${-UNIT_Y} L ${UNIT_X} ${UNIT_Y}`} />
    </>
  );
};

export const drawer = (element) => {
  return `to[variable capacitor${getPathAttributes(element)}] `;
};

export default connect(mapStateToProps)(
  withPathAttributes({ width: capacitor_width / 2, height })(Vcapacitor)
);
