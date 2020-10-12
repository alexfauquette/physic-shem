import React from "react";
import { connect } from "react-redux";
// import { MODE_LINK, MODE_SELECT } from "../redux/store";
import "./style.scss";

// If id => it's from scene
// If no id => it's from adding
const mapStateToProps = (state, props) => {
  return props.id ? { mode: state.mode, anchors: state.anchors } : {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

const Lampe = ({
  from,
  to,
  anchors,
  mode,
  selected,
  showHandles,
  id,
  ...props
}) => {
  if (!anchors || !anchors.byId[from] || !anchors.byId[to]) {
    return null;
  }
  const { x: xFrom, y: yFrom } = anchors.byId[from];
  const { x: xTo, y: yTo } = anchors.byId[to];

  const d = Math.sqrt((xFrom - xTo) ** 2 + (yFrom - yTo) ** 2);
  const ratio = 1 / 2 - 10 / d;
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
          <circle cx={0} cy={0} r={10} />
          <path d={`M -7 -7 L 7 7 M -7 7 L 7 -7`} />
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
        {/*
        path to help hover event
        <path
          d={`M -25 0 L 25 0`}
          style={{ stroke: "transparent", strokeWidth: "10" }}
        /> */}
      </g>
      {/* helper for selection */}
      {/* <circle
        cx={-20}
        cy={0}
        r={5}
        className="handle"
        onClick={
          (mode === MODE_SELECT && startLinking(id, x - 20, y)) ||
          (mode === MODE_LINK && stopLinking(id, x - 20, y)) ||
          null
        }
      />
      <circle
        cx={20}
        cy={0}
        r={5}
        className="handle"
        onClick={
          (mode === MODE_SELECT && startLinking(id, x + 20, y)) ||
          (mode === MODE_LINK && stopLinking(id, x + 20, y)) ||
          null
        }
      /> */}
    </g>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Lampe);
