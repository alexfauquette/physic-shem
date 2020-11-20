import React from "react";
import { connect } from "react-redux";
import "./style.scss";

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

const constante = 120;

const Vcapacitor = ({
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

  const ratio = (d - constante * 2 * 0.13) / (2 * d); // ratio of the line use by connection
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
            d={`M  ${-0.13 * constante} ${-0.4 * constante} L ${
              -0.13 * constante
            } ${constante * 0.4}`}
          />

          <path
            d={`M  ${constante * 0.13} ${-0.4 * constante} L ${
              constante * 0.13
            } ${constante * 0.4}`}
          />

          <path
            d={`M ${-0.4 * constante} ${-0.4 * constante} L ${
              constante * 0.4
            } ${constante * 0.4}`}
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
  `\\draw (${(from.x / 120).toFixed(2)}, ${(-from.y / 120).toFixed(
    2
  )}) to[variable capacitor] (${(to.x / 120).toFixed(2)}, ${(
    -to.y / 120
  ).toFixed(2)});`;

export default connect(mapStateToProps)(Vcapacitor);
