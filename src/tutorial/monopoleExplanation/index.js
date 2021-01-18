import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Slider from "@material-ui/core/Slider";

const getCoordinates = (x = 1, y = 1) => ({
  coord1: {
    id: "coord1",
    x: x * 100,
    y: -y * 100,
    shape: "",
  },
});

const getComponents = (type, angle) => ({
  id1: {
    id: "id1",
    position: "coord1",
    type: type,
    angle: angle,
  },
});

const components_available = {
  ground: "ground",
  vee: "vee",
  vcc: "vcc",
};

const Explanation = ({ withAngle = false, withPosition = false }) => {
  const [element_type, setType] = useState("ground");

  const [angle, setAngle] = useState(0);
  const [x, setX] = useState(1);
  const [y, setY] = useState(1);

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
            value={element_type}
            onChange={(event) => setType(event.target.value)}
          >
            {Object.keys(components_available).map((type_el) => (
              <MenuItem value={type_el} key={type_el}>
                {components_available[type_el]}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
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
              max={5}
              valueLabelDisplay="auto"
              value={x}
              onChange={(event, newValue) => setX(newValue)}
            />
            <label>y</label>
            <Slider
              defaultValue={1}
              step={0.1}
              min={0}
              max={2}
              valueLabelDisplay="auto"
              value={y}
              onChange={(event, newValue) => setY(newValue)}
            />
          </>
        )}
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={getComponents(element_type, withAngle ? angle : 0)}
          coordinates={getCoordinates(
            withPosition ? x : 1,
            withPosition ? y : 1
          )}
          svgOption={{
            width: 500,
            height: 200,
          }}
        />
      </div>
    </div>
  );
};

export default Explanation;
