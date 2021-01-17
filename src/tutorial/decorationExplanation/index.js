import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

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

const getCoordinates = (shape1, shape2) => ({
  coord1: {
    id: "coord1",
    x: 100,
    y: -100,
    shape: shape1,
  },
  coord2: {
    id: "coord2",
    x: 400,
    y: -100,
    shape: shape2,
  },
});

const Explanation = () => {
  const [shape1, setShape1] = useState("*");
  const [shape2, setShape2] = useState("*");

  return (
    <div className={styles.root}>
      <div className={styles.options}>
        <FormControl className={styles.selector}>
          <InputLabel id="input-for-shape1">decoration 1</InputLabel>
          <Select
            labelId="input-for-shape1"
            value={shape1}
            onChange={(event) => setShape1(event.target.value)}
          >
            <MenuItem value={"rien"}>rien</MenuItem>
            <MenuItem value={"*"}>*</MenuItem>
            <MenuItem value={"o"}>o</MenuItem>
            <MenuItem value={"d"}>d</MenuItem>
          </Select>
        </FormControl>
        <FormControl className={styles.selector}>
          <InputLabel id="input-for-shape2">decoration 2</InputLabel>
          <Select
            labelId="input-for-shape2"
            value={shape2}
            onChange={(event) => setShape2(event.target.value)}
          >
            <MenuItem value={"rien"}>rien</MenuItem>
            <MenuItem value={"*"}>*</MenuItem>
            <MenuItem value={"o"}>o</MenuItem>
            <MenuItem value={"d"}>d</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={components}
          coordinates={getCoordinates(shape1, shape2)}
          svgOption={{ width: 500, height: 200 }}
        />
      </div>
    </div>
  );
};

export default Explanation;
