import React from "react";
import { connect } from "react-redux";
import "./style.scss";

import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "./constantes";

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

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const x = element.positionCoords.x - x0;
  const y = element.positionCoords.y - y0;

  const { angle } = element;

  rc.path(
    `M ${rotation(angle, x, y, -0.5 * STEP, -0.8 * STEP)} 
      L ${rotation(angle, x, y, 0, -1.5 * STEP)}
      L ${rotation(angle, x, y, 0.5 * STEP, -0.8 * STEP)}
      M ${rotation(angle, x, y, 0, 0)} 
      L ${rotation(angle, x, y, 0, -1.5 * STEP)}`
  );
};

export const drawer = (element) => {
  return `node[vcc${
    element.angle && element.angle !== 0 ? " ,rotate=" + element.angle : ""
  }]{}`;
};

export default connect(mapStateToProps)(VCC);
