import React from "react";
import { connect } from "react-redux";
import "./style.scss";
import { MULTIPLICATIVE_CONST, R_LEN } from "./constantes";

const height = 0.8;
const height_2 = 0.3;
const width = 0.8;

const UNIT_X = 0.5 * width * MULTIPLICATIVE_CONST;
const UNIT_Y2 = 0.5 * height_2 * MULTIPLICATIVE_CONST;
const UNIT_Y = 0.5 * height * MULTIPLICATIVE_CONST;

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

const PR = ({
  fromCoords,
  toCoords,
  mode,
  selected,
  showHandles,
  id,
  wiper_pos = 0.5,
  ...props
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);

  const ratio = (d - width * MULTIPLICATIVE_CONST) / (2 * d); // ratio of the line use by connection
  const angle = parseInt(
    (180 * Math.atan2(yTo - yFrom, xTo - xFrom)) / Math.PI
  );
  return (
    <g className={`component ${selected ? "red" : "black"}`}>
      <g {...props}>
        <g
          style={{
            transform: `translate(${(xFrom + xTo) / 2}px , ${
              (yFrom + yTo) / 2
            }px) rotate(${angle}deg)`,
          }}
        >
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
            d={`M ${
              -(0.5 - wiper_pos) * width * MULTIPLICATIVE_CONST
            } ${-UNIT_Y} L ${
              -(0.5 - wiper_pos) * width * MULTIPLICATIVE_CONST
            } ${-UNIT_Y2}`}
          />
        </g>

        {/* here start the connection between dipole and anchors */}
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
      </g>
    </g>
  );
};

export const drawer = (element, from, to) =>
  `\\draw (${((from.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}, ${(
    (-from.y / MULTIPLICATIVE_CONST) *
    R_LEN
  ).toFixed(2)}) to[pR] (${((to.x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(
    2
  )}, ${((-to.y / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)});`;

export default connect(mapStateToProps)(PR);
