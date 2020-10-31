import React from "react";
import { connect } from "react-redux";
import "./style.scss";

const getElementTranslation = (positionAnchor) => {
  switch (positionAnchor) {
    case "B":
      return { x: 100, y: 0 };
    case "C":
      return { x: 0, y: 75 };
    case "E":
      return { x: 0, y: -75 };
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
            <path d={`M -100 0 L -60 0`} />
            <path d={`M -60 -27 L -60 27`} />
            <path d={`M -50 -37 L -50 37`} />
            <path d={`M 0 75 L 0 27 L -50 27`} />
            <path d={`M 0 -75 L 0 -27 L -50 -27`} />
          </g>
        </g>
      </g>
    </g>
  );
};

export default connect(mapStateToProps)(NMOS);
