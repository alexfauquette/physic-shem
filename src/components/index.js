import React from "react";
import Lampe, { drawer as lampeDrawer } from "./Lampe";
import EmptyDiode, {
  drawer as emptyDiodeDrawer,
  roughComponent as emptyDiodeRoughComponent,
} from "./empty_diode";
import PR, { getAnchor as pR_getAnchor, drawer as pRDrawer } from "./pR";
import Vcapacitor, { drawer as vcapacitorDrawer } from "./vcapacitor";
import NMOS, {
  getAnchor as nmos_getAnchor,
  drawer as nmosDrawer,
  roughComponent as nmosRoughComponent,
} from "./nmos";
import VEE, { getAnchor as vee_getAnchor, drawer as veeDrawer } from "./vee";
import VCC, { getAnchor as vcc_getAnchor, drawer as vccDrawer } from "./vcc";
import C, { drawer as cDrawer } from "./C";
import R, { drawer as rDrawer } from "./R";
import Battery1, { drawer as battery1Drawer } from "./battery1";
import Switch, { drawer as switchDrawer } from "./switch";

import Short, { drawer as shortDrawer } from "./short";
import RightUp, { drawer as rightUpDrawer } from "./rightUp";
import UpRight, { drawer as upRightDrawer } from "./upRight";

const getAnchors = {
  pR: (props) => pR_getAnchor(props),
  nmos: (props) => nmos_getAnchor(props),
  vee: (props) => vee_getAnchor(props),
  vcc: (props) => vcc_getAnchor(props),
};

const getDrawer = {
  short: shortDrawer,
  rightUp: rightUpDrawer,
  upRight: upRightDrawer,
  lampe: lampeDrawer,
  "empty led": emptyDiodeDrawer,
  pR: pRDrawer,
  nmos: nmosDrawer,
  vee: veeDrawer,
  vcc: vccDrawer,
  vcapacitor: vcapacitorDrawer,
  C: cDrawer,
  R: rDrawer,
  battery1: battery1Drawer,
  switch: switchDrawer,
};

const getRoughComponents = {
  nmos: nmosRoughComponent,
  "empty led": emptyDiodeRoughComponent,
};

export const roughComponents = (rc, x0, y0, element) =>
  getRoughComponents[element.type](rc, x0, y0, element);

export const getElementAnchors = (element) => {
  return getAnchors[element.type] ? getAnchors[element.type](element) : [];
};

export const drawElement = (element, position1, position2) => {
  return getDrawer[element.type](element, position1, position2);
};

export const isPath = {
  short: true,
  rightUp: true,
  upRight: true,
  lampe: true,
  "empty led": true,
  pR: true,
  nmos: false,
  vee: false,
  vcc: false,
  vcapacitor: true,
  C: true,
  R: true,
  battery1: true,
  switch: true,
};

export const isMultyPole = {
  short: false,
  rightUp: false,
  upRight: false,
  lampe: false,
  "empty led": false,
  pR: false,
  nmos: true,
  vee: false,
  vcc: false,
  vcapacitor: false,
  C: false,
  R: false,
  battery1: false,
  switch: false,
};

const components = {
  short: (props) => <Short key={props.id} {...props} />,
  rightUp: (props) => <RightUp key={props.id} {...props} />,
  upRight: (props) => <UpRight key={props.id} {...props} />,
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
  pR: (props) => <PR key={props.id} {...props} />,
  nmos: (props) => <NMOS key={props.id} {...props} />,
  vee: (props) => <VEE key={props.id} {...props} />,
  vcc: (props) => <VCC key={props.id} {...props} />,
  vcapacitor: (props) => <Vcapacitor key={props.id} {...props} />,
  C: (props) => <C key={props.id} {...props} />,
  R: (props) => <R key={props.id} {...props} />,
  battery1: (props) => <Battery1 key={props.id} {...props} />,
  switch: (props) => <Switch key={props.id} {...props} />,
};

export const structure = {
  bipoles: [
    "lampe",
    "R",
    "C",
    "switch",
    "battery1",
    "empty led",
    "vcapacitor",
    "pR",
  ],
  sources: [],
  references: ["vee", "vcc"],
  transistors: ["nmos"],
};

export default components;
