import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";
import { withPathAttributes, getPathAttributes } from "./hoc/pathComponents";

const width = 0.6;
const height = 0.6;
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

const Lampe = ({}) => {
  return (
    <>
      <circle cx={0} cy={0} r={R} />
      <path d={`M -${r} -${r} L ${r} ${r} M -${r} ${r} L ${r} -${r}`} />
    </>
  );
};

export const drawer = (element) => {
  return `to[lamp${getPathAttributes(element)}] `;
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withPathAttributes({ width, height })(Lampe));
