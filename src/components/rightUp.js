import React from "react";
import { connect } from "react-redux";
import "./style.scss";

const mapStateToProps = (state, props) => {
  return props.id
    ? {
        fromCoords: state.coordinates.byId[props.from],
        toCoords: state.coordinates.byId[props.to],
      }
    : {};
};

const RightUp = ({ fromCoords, toCoords, selected, onMouseDown }) => {
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
      <path d={`M ${xFrom} ${yFrom} L ${xTo} ${yFrom}L ${xTo} ${yTo}`} />
    </g>
  );
};

export const roughComponent = (rc, ctx, x0, y0, element) => {
  const xFrom = element.fromCoords.x - x0;
  const yFrom = element.fromCoords.y - y0;

  const xTo = element.toCoords.x - x0;
  const yTo = element.toCoords.y - y0;

  rc.path(`M ${xFrom} ${yFrom} L ${xTo} ${yFrom} L ${xTo} ${yTo}`);
};

export const drawer = () => {
  return `-| `;
};

export const parameters = {};

export default connect(mapStateToProps)(RightUp);
