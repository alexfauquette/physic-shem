import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const height = 0.5;
const width = 0.4;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

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

const EmptyDiode = ({}) => {
  return (
    <>
      <path
        d={`M ${UNIT_X} 0 L ${-UNIT_X} ${-UNIT_Y} L ${-UNIT_X} ${UNIT_Y} Z`}
      />
      <path d={`M ${UNIT_X} ${UNIT_Y} L ${UNIT_X} ${-UNIT_Y}`} />
    </>
  );
};

export const drawer = (element) => {
  return `to[empty diode${getPathAttributes(element)}] `;
};

export default connect(mapStateToProps)(
  withPathAttributes({ width, height })(EmptyDiode)
);
