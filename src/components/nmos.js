import React from "react";
import { connect } from "react-redux";
import "./style.scss";

import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";

const width = 0.7;
const gate_height = 0.35;
const base_height = 0.5;
// const conn_height = 0;
const height = 1.1;
const base_width = 0.5;
const gate_width = 0.62;
// const arrow_pos = 0.6;
// const bodydiode_scale = 0.3;
// const bodydiode_distance = 0.3;
// const bodydiode_conn = 0.6;
// const curr_direction = 1;

const UNIT_X = width * MULTIPLICATIVE_CONST;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST;

const getElementTranslation = (positionAnchor) => {
  switch (positionAnchor) {
    case "B":
      return { x: UNIT_X, y: 0 };
    case "C":
      return { x: 0, y: UNIT_Y };
    case "E":
      return { x: 0, y: -UNIT_Y };
    default:
      return { x: 0, y: 0 };
  }
};

export const getAnchor = ({ positionAnchor, angle = 0, positionCoords }) => {
  const { x, y } = positionCoords;

  const { x: dx, y: dy } = getElementTranslation(positionAnchor);

  const Cgap = getElementTranslation("C");
  const Bgap = getElementTranslation("B");
  const Egap = getElementTranslation("E");
  const radAngle = (Math.PI * angle) / 180;

  const Crad = Math.atan2(dy - Cgap.y, dx - Cgap.x);
  const Brad = Math.atan2(dy - Bgap.y, dx - Bgap.x);
  const Erad = Math.atan2(dy - Egap.y, dx - Egap.x);

  const distanceC = Math.sqrt((Cgap.x - dx) ** 2 + (Cgap.y - dy) ** 2);
  const distanceB = Math.sqrt((Bgap.x - dx) ** 2 + (Bgap.y - dy) ** 2);
  const distanceE = Math.sqrt((Egap.x - dx) ** 2 + (Egap.y - dy) ** 2);

  return [
    {
      name: "C",
      x: x + Math.cos(-radAngle + Crad) * distanceC,
      y: y + Math.sin(-radAngle + Crad) * distanceC,
    },
    {
      name: "B",
      x: x + Math.cos(-radAngle + Brad) * distanceB,
      y: y + Math.sin(-radAngle + Brad) * distanceB,
    },
    {
      name: "E",
      x: x + Math.cos(-radAngle + Erad) * distanceE,
      y: y + Math.sin(-radAngle + Erad) * distanceE,
    },
  ];
};

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id
    ? {
        mode: state.mode,
        // allows to create components directly without using the store
        positionCoords: state.anchors.byId[props.position],
      }
    : {};
};

const NMOS = ({
  positionCoords,
  positionAnchor = "",
  angle = 0,
  mode,
  selected,
  showHandles,
  id,
  ...props
}) => {
  if (!positionCoords) {
    return null;
  }
  const { x: xAnchor, y: yAnchor } = positionCoords;
  const { x: deltaX, y: deltaY } = getElementTranslation(positionAnchor);

  return (
    <g className={`component ${selected ? "red" : "black"}`}>
      <g {...props}>
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
            <circle cx={0} cy={0} r="5" />
            <path
              d={`M ${0} ${-UNIT_Y} 
                  L ${0} ${-gate_height * UNIT_Y}
                  L ${-base_width * UNIT_X} ${-gate_height * UNIT_Y}`}
            />
            <path
              d={`M ${-base_width * UNIT_X} ${-base_height * UNIT_Y}
                  L ${-base_width * UNIT_X} ${base_height * UNIT_Y}
                  L ${-base_width * UNIT_X} ${gate_height * UNIT_Y}
                  L ${0} ${gate_height * UNIT_Y}
                  L ${0} ${UNIT_Y}`}
            />
            <path
              d={`M ${-gate_width * UNIT_X} ${-gate_height * UNIT_Y}
                  L ${-gate_width * UNIT_X} ${gate_height * UNIT_Y}`}
              style={{ strokeWidth: 2 }}
            />
            <path
              d={`M ${-gate_width * UNIT_X} 0
                      L ${-UNIT_X} 0`}
            />
          </g>
        </g>
      </g>
    </g>
  );
};

export const drawer = (element, position) => {
  return `\\draw (${((position.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(
    2
  )}, ${((-position.y / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}) node[nmos${
    element.positionAnchor ? " ,anchor=" + element.positionAnchor : ""
  }${
    element.angle && element.angle !== 0 ? " ,rotate=" + element.angle : ""
  }]{};`;
};

export default connect(mapStateToProps)(NMOS);
