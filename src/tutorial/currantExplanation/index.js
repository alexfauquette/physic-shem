import React, { useState } from "react";
import Displayer from "../interaction";
import styles from "./index.module.scss";

import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import CachedIcon from "@material-ui/icons/Cached";

const default_components = {
  id1: {
    id: "id1",
    from: "coord1",
    to: "coord2",
    type: "R",
    currant: {
      show: true,
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
const default_coordinates = {
  coord1: {
    id: "coord1",
    x: 100,
    y: -100,
    shape: "o",
  },
  coord2: {
    id: "coord2",
    x: 400,
    y: -100,
    shape: "*",
  },
};

const Explanation = () => {
  const [components, setComponents] = useState(default_components);
  const [coordinates, setCoordinates] = useState(default_coordinates);
  const [left2right, setLeft2right] = useState(true);

  const setCurrantDirection = (value) => () => {
    setComponents({
      ...components,
      ["id1"]: {
        ...components.id1,
        ["currant"]: {
          ...components.id1.currant,
          ["currantIsForward"]: value,
        },
      },
    });
  };

  const setCurrantXPosition = (value) => () => {
    setComponents({
      ...components,
      ["id1"]: {
        ...components.id1,
        ["currant"]: {
          ...components.id1.currant,
          ["currantIsAfter"]: value,
        },
      },
    });
  };

  const setCurrantYPosition = (value) => () => {
    setComponents({
      ...components,
      ["id1"]: {
        ...components.id1,
        ["currant"]: {
          ...components.id1.currant,
          ["currantIsAbove"]: value,
        },
      },
    });
  };

  const switchPoisitions = () => {
    const left = {
      x: default_coordinates.coord1.x,
      y: default_coordinates.coord1.y,
    };
    const right = {
      x: default_coordinates.coord2.x,
      y: default_coordinates.coord2.y,
    };
    setCoordinates({
      ...coordinates,
      coord1: { ...coordinates.coord1, ...(left2right ? right : left) },
      coord2: { ...coordinates.coord2, ...(left2right ? left : right) },
    });
    setLeft2right(!left2right);
  };

  const isForard = components.id1.currant.currantIsForward;
  const isAfter = components.id1.currant.currantIsAfter;
  const isAbove = components.id1.currant.currantIsAbove;

  return (
    <div className={styles.root}>
      <div className={styles.options}>
        <label>sens du courant</label>
        <ButtonGroup
          color="primary"
          size="medium"
          aria-label="outlined primary button group"
        >
          <Button
            variant={isForard ? "contained" : "outlined"}
            onClick={setCurrantDirection(true)}
          >
            direct
          </Button>
          <Button
            variant={!isForard ? "contained" : "outlined"}
            onClick={setCurrantDirection(false)}
          >
            indirect
          </Button>
        </ButtonGroup>

        <label>position de la fléche</label>
        <ButtonGroup
          color="primary"
          size="medium"
          aria-label="outlined primary button group"
        >
          <Button
            variant={isAfter ? "contained" : "outlined"}
            onClick={setCurrantXPosition(true)}
          >
            après
          </Button>
          <Button
            variant={!isAfter ? "contained" : "outlined"}
            onClick={setCurrantXPosition(false)}
          >
            avant
          </Button>
        </ButtonGroup>

        <label>position du text</label>
        <ButtonGroup
          color="primary"
          size="medium"
          aria-label="outlined primary button group"
        >
          <Button
            variant={isAbove ? "contained" : "outlined"}
            onClick={setCurrantYPosition(true)}
          >
            haut
          </Button>
          <Button
            variant={!isAbove ? "contained" : "outlined"}
            onClick={setCurrantYPosition(false)}
          >
            bas
          </Button>
        </ButtonGroup>

        <label>changer le sens</label>
        <Button onClick={switchPoisitions} variant="outlined">
          <CachedIcon />
        </Button>
      </div>
      <div className={styles.drawing}>
        <Displayer
          components={components}
          coordinates={coordinates}
          svgOption={{ width: 500, height: 200 }}
        />
      </div>
    </div>
  );
};

export default Explanation;
