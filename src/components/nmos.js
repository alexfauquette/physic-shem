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
// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id
    ? {
        mode: state.mode,
        // allows to create components directly without using the store
        positionCoords: state.anchors.byId[props.from],
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
