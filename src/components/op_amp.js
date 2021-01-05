import React from "react";
import { connect } from "react-redux";
import "./style.scss";

import { MULTIPLICATIVE_CONST, R_LEN, rotation } from "utils";

const width = 1.7; // Total width
const port_width = 0.7; // Terminals length
const height = 1.4; // Total height
const input_height = 0.5; // Input port vertical separation
const up_pos = 0.45; // Top and bottom anchor position
// const font = \pgf@circ@font@tenbm // Absolute font size needed!

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST * R_LEN;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST * R_LEN;

const getElementTranslation = (positionAnchor) => {
  const upX = (1 - 2 * up_pos) * (port_width * UNIT_X);
  const upY = (1 - up_pos) * UNIT_Y;
  switch (positionAnchor) {
    case "+":
      return { x: UNIT_X, y: -input_height * UNIT_Y };
    case "-":
      return { x: UNIT_X, y: input_height * UNIT_Y };
    case "up":
      return { x: upX, y: upY };
    case "down":
      return { x: upX, y: -upY };
    case "out":
      return { x: -UNIT_X, y: 0 };
    default:
      return { x: 0, y: 0 };
  }
};

export const getBoundingBox = ({ angle = 0, positionCoords }) => {
  return {
    x: positionCoords.x,
    y: positionCoords.y,
    angle,
    dx1: -UNIT_X,
    dx2: UNIT_X,
    dy1: -UNIT_Y,
    dy2: UNIT_Y,
  };
};

export const getAnchor = ({ positionAnchor, angle = 0, positionCoords }) => {
  const { x, y } = positionCoords;

  const { x: dx, y: dy } = getElementTranslation(positionAnchor);

  return ["+", "-", "up", "down", "out"].map((name) => {
    const gap = getElementTranslation(name);

    const radAngle = (Math.PI * angle) / 180;

    const anchorRad = Math.atan2(dy - gap.y, dx - gap.x);
    const distance = Math.sqrt((gap.x - dx) ** 2 + (gap.y - dy) ** 2);
    return {
      name: name,
      x: x + Math.cos(-radAngle + anchorRad) * distance,
      y: y + Math.sin(-radAngle + anchorRad) * distance,
    };
  });
};

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id
    ? {
        mode: state.mode,
        // allows to create components directly without using the store
        positionCoords: state.coordinates.byId[props.position],
      }
    : {};
};

const OpAmp = ({
  positionCoords,
  positionAnchor = "",
  angle = 0,
  selected,

  onMouseDown,
}) => {
  if (!positionCoords) {
    return null;
  }
  const { x: xAnchor, y: yAnchor } = positionCoords;
  const { x: deltaX, y: deltaY } = getElementTranslation(positionAnchor);

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
        <g
          style={{
            transform: `translate(${deltaX}px , ${deltaY}px)`,
          }}
        >
          {/* Triangle */}
          <path
            d={`M ${port_width * UNIT_X} 0
            L ${-port_width * UNIT_X} ${UNIT_Y}
            L ${-port_width * UNIT_X} ${-UNIT_Y}
            Z`}
          />
          {/* % Negative input terminal */}
          <path
            d={`M ${-UNIT_X} ${-input_height * UNIT_Y}
               L ${-port_width * UNIT_X} ${-input_height * UNIT_Y}`}
          />
          <path
            d={`M ${-port_width * UNIT_X + 10} ${-input_height * UNIT_Y} L ${
              -port_width * UNIT_X + 30
            } ${-input_height * UNIT_Y}`}
          />

          {/* % Positive input terminal */}
          <path
            d={`M ${-UNIT_X} ${input_height * UNIT_Y}
                L ${-port_width * UNIT_X} ${input_height * UNIT_Y}`}
          />
          <path
            d={`M ${-port_width * UNIT_X + 10} ${input_height * UNIT_Y}
              L ${-port_width * UNIT_X + 30} ${input_height * UNIT_Y}
              M ${-port_width * UNIT_X + 20} ${input_height * UNIT_Y - 10}
              L ${-port_width * UNIT_X + 20} ${input_height * UNIT_Y + 10}`}
          />

          {/* % Output terminal */}
          <path
            d={`M ${UNIT_X} 0
                L ${port_width * UNIT_X} 0`}
          />
        </g>
      </g>
    </g>
  );
};

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const x = element.positionCoords.x - x0;
  const y = element.positionCoords.y - y0;

  const { angle } = element;

  rc.path(
    `M ${rotation(angle, x, y, port_width * UNIT_X, 0)} 
      L ${rotation(angle, x, y, -port_width * UNIT_X, UNIT_Y)}
      L ${rotation(angle, x, y, -port_width * UNIT_X, -UNIT_Y)}
      Z
      M ${rotation(angle, x, y, -UNIT_X, -input_height * UNIT_Y)}
      L ${rotation(angle, x, y, -port_width * UNIT_X, -input_height * UNIT_Y)}
      M ${rotation(angle, x, y, -UNIT_X, input_height * UNIT_Y)}
      L ${rotation(angle, x, y, -port_width * UNIT_X, input_height * UNIT_Y)}
      M ${rotation(angle, x, y, UNIT_X, 0)}
      L ${rotation(angle, x, y, port_width * UNIT_X, 0)}
      M ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 10,
        -input_height * UNIT_Y
      )}
      L ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 30,
        -input_height * UNIT_Y
      )}
      M ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 10,
        input_height * UNIT_Y
      )}
      L ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 30,
        input_height * UNIT_Y
      )}
      M ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 20,
        input_height * UNIT_Y - 10
      )}
      L ${rotation(
        angle,
        x,
        y,
        -port_width * UNIT_X + 20,
        input_height * UNIT_Y + 10
      )}`
  );
};

export const drawer = (element, positionInformations, name = null) => {
  const { x, y, position, anchor } = positionInformations;

  const coord = position
    ? `(${position})`
    : `(${(x / MULTIPLICATIVE_CONST).toFixed(2)}, ${(
        -y / MULTIPLICATIVE_CONST
      ).toFixed(2)})`;

  return `\\draw ${coord} node[op amp${anchor ? `, anchor=${anchor}` : ""}${
    element.angle && parseFloat(element.angle) !== 0
      ? `, rotate=${element.angle}`
      : ""
  }]${name ? `(${name})` : ""}{};`;
};

export default connect(mapStateToProps)(OpAmp);
