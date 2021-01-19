import React, { useState, useEffect } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import Slider from "@material-ui/core/Slider";
import { getElementAnchors } from "components";

const getAnchors = (type) =>
  getElementAnchors({
    type: type,
    angle: 0,
    positionCoords: { x: 0, y: 0 },
  }).map(({ name }) => name);

const getCoordinates = ({ x, y, type, anchor, angle = 0 }) => {
  const anchors = getElementAnchors({
    type: type,
    angle: angle,
    positionCoords: { x: 0, y: 0 },
  });
  const anchorInfo = anchors.filter((elem) => elem.name === anchor);

  let dx = 0;
  let dy = 0;
  if (anchorInfo.length === 1) {
    dx = -anchorInfo[0].x;
    dy = -anchorInfo[0].y;
  }

  return {
    coord1: {
      id: "coord1",
      x: x * 100 + dx,
      y: -y * 100 + dy,
      dx,
      dy,
      shape: "",
    },
  };
};

const getComponents = (type, angle, anchor) => ({
  id1: {
    id: "id1",
    position: "coord1",
    type: type,
    angle: angle,
    anchor: anchor,
  },
});

const components_available = {
  nmos: "nmos",
  op_amp: "op_amp",
};

const Explanation = ({
  withAnchor = false,
  withAngle = false,
  withPosition = false,
}) => {
  const [type, setType] = useState("nmos");
  const [anchor, setAnchor] = useState("");
  const [availableAnchors, setAvailableAnchors] = useState(getAnchors("nmos"));

  const [angle, setAngle] = useState(0);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

  useEffect(() => {
    setAvailableAnchors(getAnchors(type));
    setAnchor("");
  }, [type]);

  console.log(availableAnchors);
  return (
    <div className={styles.root}>
      <div className={styles.options}>
        <FormControl className={styles.selector}>
          <InputLabel id="select-component-to-draw">
            Type de composant
          </InputLabel>
          <Select
            labelId="select-component-to-draw"
            id="demo-simple-select"
            value={type}
            onChange={(event) => setType(event.target.value)}
          >
            {Object.keys(components_available).map((type_el) => (
              <MenuItem value={type_el} key={type_el}>
                {components_available[type_el]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {withAnchor && (
          <FormControl className={styles.selector}>
            <InputLabel id="select-associated-anchor">anchor</InputLabel>
            <Select
              labelId="select-associated-anchor"
              id="demo-simple-select"
              value={anchor}
              onChange={(event) => setAnchor(event.target.value)}
            >
              <MenuItem value={""}>None</MenuItem>
              {availableAnchors.map((anchorName) => (
                <MenuItem value={anchorName} key={anchorName}>
                  {anchorName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
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
          components={getComponents(type, angle, anchor)}
          coordinates={getCoordinates({ x, y, type, anchor, angle })}
          svgOption={{
            width: 600,
            height: 300,
          }}
        />
      </div>
    </div>
  );
};

export default Explanation;
