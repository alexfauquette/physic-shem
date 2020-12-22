import React from "react";
import { connect } from "react-redux";
import "./style.scss";

import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";

const width = 0.2;

const STEP = width * R_LEN * MULTIPLICATIVE_CONST;

export const getAnchor = ({ positionCoords }) => {
  const { x, y } = positionCoords;

  return [
    {
      name: "C",
      x: x,
      y: y,
    },
  ];
};

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id
    ? {
        // allows to create components directly without using the store
        positionCoords: state.anchors.byId[props.position],
      }
    : {};
};

const VCC = ({ positionCoords, angle = 0, selected, onMouseDown }) => {
  if (!positionCoords) {
    return null;
  }
  const { x: xAnchor, y: yAnchor } = positionCoords;

  return (
    <g
      onMouseDown={onMouseDown || null}
      className={`component ${selected ? "red" : "black"}`}
    >
      <g
        style={{
          transform: `translate(${xAnchor}px , ${yAnchor}px) rotate(${-angle}deg)`,
        }}
      >
        <path
          d={`M ${-0.5 * STEP} ${-0.8 * STEP}
                L 0 ${-1.5 * STEP}
                L ${0.5 * STEP} ${-0.8 * STEP}`}
        />
        <path
          d={`M 0 0
                L 0 ${-1.5 * STEP}`}
        />
      </g>
    </g>
  );
};

export const drawer = (element) => {
  return `node[vcc]{}`;
};

export default connect(mapStateToProps)(VCC);
