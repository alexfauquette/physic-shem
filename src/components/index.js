import React from "react";
import Lampe, { drawer as lampeDrawer } from "./Lampe";
import EmptyDiode, { drawer as emptyDiodeDrawer } from "./empty_diode";
import PR, { getAnchor as pR_getAnchor, drawer as pRDrawer } from "./pR";
import NMOS, {
  getAnchor as nmos_getAnchor,
  drawer as nmosDrawer,
} from "./nmos";

const getAnchors = {
  lampe: () => [],
  "empty led": () => [],
  pR: (props) => pR_getAnchor(props),
  nmos: (props) => nmos_getAnchor(props),
const getDrawer = {
  lampe: lampeDrawer,
  "empty led": emptyDiodeDrawer,
  pR: pRDrawer,
  nmos: nmosDrawer,
};

export const getElementAnchors = (element) => {
  return getAnchors[element.type](element);
};

export const drawElement = (element, position1, position2) => {
  return getDrawer[element.type](element, position1, position2);
};

export const isPath = {
  lampe: true,
  "empty led": true,
  pR: true,
  nmos: false,
};

const components = {
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
  pR: (props) => <PR key={props.id} {...props} />,
  nmos: (props) => <NMOS key={props.id} {...props} />,
};

export default components;
