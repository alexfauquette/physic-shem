import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";

const coordinates = {
  coord1: {
    id: "coord1",
    x: 100,
    y: -100,
    shape: "",
  },
  coord2: {
    id: "coord2",
    x: 400,
    y: -100,
    shape: "",
  },
};

const multCoordinates = {
  coord0: {
    id: "coord0",
    x: 400,
    y: -100,
    shape: "",
  },
  coord1: {
    id: "coord1",
    x: 700,
    y: -100,
    shape: "",
  },
  coord2: {
    id: "coord2",
    x: 700,
    y: -400,
    shape: "",
  },
  coord3: {
    id: "coord3",
    x: 400,
    y: -400,
    shape: "",
  },
  coord4: {
    id: "coord4",
    x: 100,
    y: -400,
    shape: "",
  },
  coord5: {
    id: "coord5",
    x: 100,
    y: -100,
    shape: "",
  },
};

const getComponents = (type, label = "", annotation = "") => ({
  id1: {
    id: "id1",
    from: "coord1",
    to: "coord2",
    type: type,
    currant: {
      show: false,
      currantText: "i1",
      currantIsForward: true,
      currantIsAbove: true,
      currantIsAfter: true,
    },
    label: label,
    annotation: annotation,
    mirror: false,
    invert: false,
  },
});

const getMultipleComponents = (type, label = "", annotation = "") => {
  const rep = {};

  [1, 2, 3, 4, 5].forEach((nb) => {
    const id = `id${nb}`;

    rep[id] = {
      id: id,
      from: "coord0",
      to: `coord${nb}`,
      type: type,
      currant: {
        show: false,
        currantText: "i1",
        currantIsForward: true,
        currantIsAbove: true,
        currantIsAfter: true,
      },
      label: label,
      annotation: annotation,
      mirror: false,
      invert: false,
    };
  });

  return rep;
};

const components_available = {
  R: "resistance : R",
  lampe: "lampe : lamp",
  battery1: "batterie : battery1",
  L: "bobine : L",
  C: "condensateur : C",
  "empty led": "led : empty diode",
  pR: "potential resistor (pR)",
  vcapacitor: "variable capacitor",
};

const Explanation = ({
  withAnnotations = false,
  withMultipleComponents = false,
}) => {
  const [element_type, setType] = useState("R");

  const [label, SetLabel] = useState("R1");
  const [annotation, SetAnnotation] = useState("hello world");

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
        {withAnnotations && (
          <>
            <TextField
              value={label}
              onChange={(event) => SetLabel(event.target.value)}
              label="label"
              className={styles.textInput}
            />
            <TextField
              value={annotation}
              onChange={(event) => SetAnnotation(event.target.value)}
              label="annotation"
              className={styles.textInput}
            />
          </>
        )}
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={
            withMultipleComponents
              ? getMultipleComponents(
                  element_type,
                  withAnnotations ? label : "",
                  withAnnotations ? annotation : ""
                )
              : getComponents(
                  element_type,
                  withAnnotations ? label : "",
                  withAnnotations ? annotation : ""
                )
          }
          coordinates={withMultipleComponents ? multCoordinates : coordinates}
          svgOption={{
            width: withMultipleComponents ? 800 : 500,
            height: withMultipleComponents ? 500 : 200,
          }}
        />
      </div>
    </div>
  );
};

export default Explanation;
