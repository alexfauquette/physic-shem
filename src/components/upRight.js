import React from "react";
import { connect } from "react-redux";
import "./style.scss";

const mapStateToProps = (state, props) => {
  return props.id
    ? {
        fromCoords: state.anchors.byId[props.from],
        toCoords: state.anchors.byId[props.to],
      }
    : {};
};

const UpRight = ({ fromCoords, toCoords, selected, onMouseDown }) => {
  if (!fromCoords || !toCoords) {
    return null;
  }

  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  return (
    <g
      onMouseDown={onMouseDown || null}
      className={`component ${selected ? "red" : "black"}`}
    >
      <path d={`M ${xFrom} ${yFrom} L ${xFrom} ${yTo}L ${xTo} ${yTo}`} />
    </g>
  );
};

export const drawer = () => {
  return `|- `;
};

export default connect(mapStateToProps)(UpRight);
