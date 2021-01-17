import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import Slider from "@material-ui/core/Slider";
import Button from "@material-ui/core/Button";
import CachedIcon from "@material-ui/icons/Cached";

const components = {
  id1: {
    id: "id1",
    from: "coord1",
    to: "coord2",
    type: "R",
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
  },
};

const getCoordinates = ({ x1, x2, y1, y2 }) => ({
  coord1: {
    id: "coord1",
    x: x1 * 100,
    y: -y1 * 100,
    shape: "",
  },
  coord2: {
    id: "coord2",
    x: x2 * 100,
    y: -y2 * 100,
    shape: "",
  },
});

const default_x1 = 1;
const default_y1 = 1;
const default_x2 = 4;
const default_y2 = 1;

const maxX = 5;
const maxY = 2;
const xMarks = [
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
  { value: 3, label: 3 },
  { value: 4, label: 4 },
  { value: 5, label: 5 },
];
const yMarks = [
  { value: 0, label: 0 },
  { value: 1, label: 1 },
  { value: 2, label: 2 },
];
const Explanation = () => {
  const [x1, setX1] = useState(default_x1);
  const [y1, setY1] = useState(default_y1);
  const [x2, setX2] = useState(default_x2);
  const [y2, setY2] = useState(default_y2);

  return (
    <div className={styles.root}>
      <div className={styles.options}>
        <ul>
          <li>
            <h4>premier point</h4>
            <label>x</label>
            <Slider
              defaultValue={default_x1}
              step={0.1}
              min={0}
              max={maxX}
              valueLabelDisplay="auto"
              marks={xMarks}
              value={x1}
              onChange={(event, newValue) => setX1(newValue)}
            />
            <label>y</label>
            <Slider
              defaultValue={default_y1}
              step={0.1}
              min={0}
              max={maxY}
              valueLabelDisplay="auto"
              marks={yMarks}
              value={y1}
              onChange={(event, newValue) => setY1(newValue)}
            />
          </li>
          <li>
            <h4>deuxième point</h4>
            <label>x</label>
            <Slider
              defaultValue={default_x2}
              step={0.1}
              min={0}
              max={maxX}
              valueLabelDisplay="auto"
              marks={xMarks}
              value={x2}
              onChange={(event, newValue) => setX2(newValue)}
            />
            <label>y</label>
            <Slider
              defaultValue={default_y2}
              step={0.1}
              min={0}
              max={maxY}
              valueLabelDisplay="auto"
              marks={yMarks}
              value={y2}
              onChange={(event, newValue) => setY2(newValue)}
            />
          </li>
        </ul>
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={components}
          coordinates={getCoordinates({ x1, x2, y1, y2 })}
          svgOption={{ width: maxX * 100, height: maxY * 100 }}
        />
      </div>
    </div>
  );
};

export default Explanation;
