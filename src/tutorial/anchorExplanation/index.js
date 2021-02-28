import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "../index.module.scss";

import Slider from "@material-ui/core/Slider";
import { getElementAnchors } from "components";

const getUsedAnchors = (x, y, angle = 0) => {
  const rep = {};
  getElementAnchors({
    type: "op_amp",
    angle: angle,
    positionCoords: { x, y },
  }).forEach(({ x, y, name }) => {
    if (name === "+" || name === "out") {
      rep[name] = { x, y };
    }
  });
  return rep;
};

const getCoordinates = ({ x, y, angle = 0, useRelativeCoord }) => {
  const anchors = getUsedAnchors(100 * x, -y * 100, angle);

  return {
    coord1: {
      id: "coord1",
      x: x * 100,
      y: -y * 100,
      shape: "",
    },
    coordP1: {
      id: "coordP1",
      x: anchors["+"].x,
      y: anchors["+"].y,
      name: "opAmp.+",
      shape: "",
    },
    coordP2: {
      id: "coordP2",
      x: useRelativeCoord ? anchors["+"].x : 1.81 * 100,
      y: useRelativeCoord ? anchors["+"].y + 200 : -0.5 * 100,
      shape: "",
    },
    coordOut1: {
      id: "coordOut1",
      x: anchors["out"].x,
      y: anchors["out"].y,
      name: "opAmp.out",
      shape: "",
    },
    coordOut2: {
      id: "coordOut2",
      x: useRelativeCoord ? anchors["out"].x : 4.19 * 100,
      y: useRelativeCoord ? anchors["out"].y + 200 : -0.5 * 100,
      shape: "",
    },
  };
};

const default_bipole = {
  currant: {
    show: false,
    currantText: "i1",
    currantIsForward: true,
    currantIsAbove: true,
    currantIsAfter: true,
  },
  label: "",
  annotation: "",
  mirror: false,
  invert: false,
};
const getComponents = (angle) => ({
  id1: {
    id: "id1",
    position: "coord1",
    type: "op_amp",
    angle: angle,
    name: "opAmp",
  },
  id2: {
    id: "id2",
    from: "coordP1",
    to: "coordP2",
    type: "R",
    ...default_bipole,
  },
  id3: {
    id: "id3",
    from: "coordOut1",
    to: "coordOut2",
    type: "R",
    ...default_bipole,
  },
});

const Explanation = ({
  withAngle = false,
  withPosition = false,
  useRelativeCoord = false,
}) => {
  const [angle, setAngle] = useState(0);
  const [x, setX] = useState(3);
  const [y, setY] = useState(3);

  return (
    <div className={styles.root}>
      <div className={`${styles.options} ${styles.optionsColumn}`}>
        {withAngle && (
          <>
            <label>angle</label>
            <Slider
              defaultValue={0}
              step={1}
              min={-180}
              max={180}
              valueLabelDisplay="auto"
              valueLabelFormat={(t) => `${t}°`}
              value={angle}
              onChange={(event, newValue) => setAngle(newValue)}
            />
          </>
        )}
        {withPosition && (
          <>
            <label>x</label>
            <Slider
              defaultValue={1}
              step={0.1}
              min={0}
              max={6}
              valueLabelDisplay="auto"
              value={x}
              onChange={(event, newValue) => setX(newValue)}
            />
            <label>y</label>
            <Slider
              defaultValue={1}
              step={0.1}
              min={0}
              max={3}
              valueLabelDisplay="auto"
              value={y}
              onChange={(event, newValue) => setY(newValue)}
            />
          </>
        )}
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={getComponents(angle)}
          coordinates={getCoordinates({ x, y, angle, useRelativeCoord })}
          svgOption={{
            width: 600,
            height: 400,
          }}
          latexOption={{ useRelativeCoord }}
        />
      </div>
    </div>
  );
};

export default Explanation;
