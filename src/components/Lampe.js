import React from "react";
import { connect } from "react-redux";
import "./style.scss";

const R = 60;
const r = ((Math.sqrt(2) * R) / 2).toFixed(3);
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

const mapDispatchToProps = (dispatch) => {
  return {};
};

const Lampe = ({
  fromCoords,
  toCoords,
  anchors,
  mode,
  selected,
  showHandles,
  id,
  ...props
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
  const ratio = 1 / 2 - R / d;
  return (
    <g className={`component ${selected ? "red" : "black"}`}>
      <g {...props}>
        <g
          style={{
            transform: `translate(${(xFrom + xTo) / 2}px, ${
              (yFrom + yTo) / 2
            }px)`,
          }}
        >
          <circle cx={0} cy={0} r={R} />
          <path d={`M -${r} -${r} L ${r} ${r} M -${r} ${r} L ${r} -${r}`} />
        </g>
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
  `\\draw (${(from.x / 120).toFixed(2)}, ${(-from.y / 120).toFixed(
    2
  )}) to[lamp] (${(to.x / 120).toFixed(2)}, ${(-to.y / 120).toFixed(2)});`;

export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
