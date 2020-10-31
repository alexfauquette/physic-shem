import React from "react";
import { connect } from "react-redux";
import "./style.scss";

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
  ...props
}) => {
  if (!fromCoords || !toCoords) {
    return null;
  }
  const { x: xFrom, y: yFrom } = fromCoords;
  const { x: xTo, y: yTo } = toCoords;

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);

  const ratio = (d - 120) / (2 * d); // ratio of the line use by connection
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
            d={`M -60 0 L -50 -20 L -30 20 L -10 -20 L 10 20 L 30 -20 L 50 20 L 60 0`}
          />
          <path d={`M 0 -20 L 0 -55`} />
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

export default connect(mapStateToProps)(PR);
