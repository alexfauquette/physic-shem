import React from "react";
import { connect } from "react-redux";
import "./style.scss";

import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";

const width = 0.25;
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
        positionCoords: state.coordinates.byId[props.position],
      }
    : {};
};

const Ground = ({ positionCoords, angle = 0, selected, onMouseDown }) => {
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
          d={`M ${-0.6 * STEP} ${1.2 * STEP} L ${0.6 * STEP} ${1.2 * STEP}
          M ${-0.4 * STEP} ${1.4 * STEP} L ${0.4 * STEP} ${1.4 * STEP}
          M ${-0.25 * STEP} ${1.6 * STEP} L ${0.25 * STEP} ${1.6 * STEP}`}
        />
        <path
          d={`M 0 0
                L 0 ${1.2 * STEP}`}
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
    `M ${rotation(angle, x, y, -0.6 * STEP, 1.2 * STEP)}
     L ${rotation(angle, x, y, 0.6 * STEP, 1.2 * STEP)}
     M ${rotation(angle, x, y, -0.4 * STEP, 1.4 * STEP)}
     L ${rotation(angle, x, y, 0.4 * STEP, 1.4 * STEP)}
     M ${rotation(angle, x, y, -0.25 * STEP, 1.6 * STEP)}
     L ${rotation(angle, x, y, 0.25 * STEP, 1.6 * STEP)}
     M ${rotation(angle, x, y, 0, 0)} 
     L ${rotation(angle, x, y, 0, 1.2 * STEP)}`
  );
};

export const drawer = (element) => {
  return `node[ground${
    element.angle && element.angle !== 0 ? " ,rotate=" + element.angle : ""
  }]{}`;
};

export default connect(mapStateToProps)(Ground);
