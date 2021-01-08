import React from "react";
import Lampe, {
  drawer as lampeDrawer,
  roughComponent as lampeRoughComponent,
  getBoundingBox as lampeGetBoundingBox,
} from "./Lampe";
import EmptyDiode, {
  drawer as emptyDiodeDrawer,
  roughComponent as emptyDiodeRoughComponent,
  getBoundingBox as emptyDiodeGetBoundingBox,
} from "./empty_diode";
import Pr, {
  getAnchor as pR_getAnchor,
  drawer as pRDrawer,
  roughComponent as pRRoughComponent,
  getBoundingBox as pRGetBoundingBox,
  parameters as pRParameters,
} from "./pR";
import Vcapacitor, {
  drawer as vcapacitorDrawer,
  roughComponent as vcapacitorRoughComponent,
  getBoundingBox as vcapacitorGetBoundingBox,
} from "./vcapacitor";
import NMOS, {
  getAnchor as nmos_getAnchor,
  drawer as nmosDrawer,
  roughComponent as nmosRoughComponent,
  getBoundingBox as nmosGetBoundingBox,
} from "./nmos";
import OpAmp, {
  getAnchor as op_amp_getAnchor,
  drawer as op_ampDrawer,
  roughComponent as op_ampRoughComponent,
  getBoundingBox as op_ampGetBoundingBox,
} from "./op_amp";
import VEE, {
  getAnchor as vee_getAnchor,
  drawer as veeDrawer,
  roughComponent as veeRoughComponent,
  getBoundingBox as veeGetBoundingBox,
} from "./vee";
import VCC, {
  getAnchor as vcc_getAnchor,
  drawer as vccDrawer,
  roughComponent as vccRoughComponent,
  getBoundingBox as vccGetBoundingBox,
} from "./vcc";
import Ground, {
  getAnchor as ground_getAnchor,
  drawer as groundDrawer,
  roughComponent as groundRoughComponent,
  getBoundingBox as groundGetBoundingBox,
} from "./ground";
import C, {
  drawer as cDrawer,
  roughComponent as cRoughComponent,
  getBoundingBox as cGetBoundingBox,
} from "./C";
import L, {
  drawer as lDrawer,
  roughComponent as lRoughComponent,
  getBoundingBox as lGetBoundingBox,
} from "./L";
import R, {
  drawer as rDrawer,
  roughComponent as rRoughComponent,
  getBoundingBox as rGetBoundingBox,
} from "./R";
import Battery1, {
  drawer as battery1Drawer,
  roughComponent as battery1RoughComponent,
  getBoundingBox as battery1GetBoundingBox,
} from "./battery1";
import Switch, {
  drawer as switchDrawer,
  roughComponent as switchRoughComponent,
  getBoundingBox as switchGetBoundingBox,
  parameters as switchParameters,
} from "./switch";

import Short, {
  drawer as shortDrawer,
  roughComponent as shortRoughComponent,
  parameters as shortParameters,
} from "./short";
import RightUp, {
  drawer as rightUpDrawer,
  roughComponent as rightUpRoughComponent,
  parameters as rightUpParameters,
} from "./rightUp";
import UpRight, {
  drawer as upRightDrawer,
  roughComponent as upRightRoughComponent,
  parameters as upRightParameters,
} from "./upRight";
import { pathGetBoundingBoxCenter } from "components/hoc/pathComponents";

const getAnchors = {
  pR: (props) => pR_getAnchor(props),
  nmos: (props) => nmos_getAnchor(props),
  op_amp: (props) => op_amp_getAnchor(props),
  vee: (props) => vee_getAnchor(props),
  vcc: (props) => vcc_getAnchor(props),
  ground: (props) => ground_getAnchor(props),
};

export const pathOptions = {
  pR: pRParameters,
  switch: switchParameters,
  short: shortParameters,
  rightUp: rightUpParameters,
  upRight: upRightParameters,
};

const getDrawer = {
  short: shortDrawer,
  rightUp: rightUpDrawer,
  upRight: upRightDrawer,
  lampe: lampeDrawer,
  "empty led": emptyDiodeDrawer,
  pR: pRDrawer,
  nmos: nmosDrawer,
  op_amp: op_ampDrawer,
  vee: veeDrawer,
  vcc: vccDrawer,
  ground: groundDrawer,
  vcapacitor: vcapacitorDrawer,
  C: cDrawer,
  L: lDrawer,
  R: rDrawer,
  battery1: battery1Drawer,
  switch: switchDrawer,
};

const getRoughComponents = {
  short: shortRoughComponent,
  rightUp: rightUpRoughComponent,
  upRight: upRightRoughComponent,
  lampe: lampeRoughComponent,
  "empty led": emptyDiodeRoughComponent,
  pR: pRRoughComponent,
  nmos: nmosRoughComponent,
  op_amp: op_ampRoughComponent,
  vee: veeRoughComponent,
  vcc: vccRoughComponent,
  ground: groundRoughComponent,
  vcapacitor: vcapacitorRoughComponent,
  C: cRoughComponent,
  L: lRoughComponent,
  R: rRoughComponent,
  battery1: battery1RoughComponent,
  switch: switchRoughComponent,
};

const getBoundingBoxComponent = {
  lampe: lampeGetBoundingBox,
  "empty led": emptyDiodeGetBoundingBox,
  pR: pRGetBoundingBox,
  nmos: nmosGetBoundingBox,
  op_amp: op_ampGetBoundingBox,
  vee: veeGetBoundingBox,
  vcc: vccGetBoundingBox,
  ground: groundGetBoundingBox,
  vcapacitor: vcapacitorGetBoundingBox,
  C: cGetBoundingBox,
  L: lGetBoundingBox,
  R: rGetBoundingBox,
  battery1: battery1GetBoundingBox,
  switch: switchGetBoundingBox,
};

export const getBoundingBox = (element, coordinateById) => {
  if (element.position) {
    const positionCoords = coordinateById[element.position];
    return getBoundingBoxComponent[element.type]({
      ...element,
      positionCoords,
    });
  } else {
    const fromCoords = coordinateById[element.from];
    const toCoords = coordinateById[element.to];
    switch (element.type) {
      case "short":
      case "rightUp":
      case "upRight":
        const { x, y } = fromCoords;
        const { x: x2, y: y2 } = toCoords;
        return { x, y, angle: 0, dx1: 0, dx2: x2 - x, dy1: 0, dy2: y2 - y };
      default:
        break;
    }
    return {
      ...pathGetBoundingBoxCenter({ fromCoords, toCoords }),
      ...getBoundingBoxComponent[element.type](element),
    };
  }
};

export const roughComponents = (rc, ctx, x0, y0, element) =>
  getRoughComponents[element.type](rc, ctx, x0, y0, element);

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
  op_amp: false,
  vee: false,
  vcc: false,
  ground: false,
  vcapacitor: true,
  C: true,
  L: true,
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
  op_amp: true,
  vee: false,
  vcc: false,
  ground: false,
  vcapacitor: false,
  C: false,
  L: false,
  R: false,
  battery1: false,
  switch: false,
};

const svgComponents = {
  short: (props) => <Short key={props.id} {...props} />,
  rightUp: (props) => <RightUp key={props.id} {...props} />,
  upRight: (props) => <UpRight key={props.id} {...props} />,
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
  pR: (props) => <Pr key={props.id} {...props} />,
  nmos: (props) => <NMOS key={props.id} {...props} />,
  op_amp: (props) => <OpAmp key={props.id} {...props} />,
  vee: (props) => <VEE key={props.id} {...props} />,
  vcc: (props) => <VCC key={props.id} {...props} />,
  ground: (props) => <Ground key={props.id} {...props} />,
  vcapacitor: (props) => <Vcapacitor key={props.id} {...props} />,
  C: (props) => <C key={props.id} {...props} />,
  L: (props) => <L key={props.id} {...props} />,
  R: (props) => <R key={props.id} {...props} />,
  battery1: (props) => <Battery1 key={props.id} {...props} />,
  switch: (props) => <Switch key={props.id} {...props} />,
};

export const structure = {
  bipoles: ["lampe", "switch", "R", "C", "L", "empty led", "vcapacitor", "pR"],
  sources: ["battery1"],
  references: ["vee", "vcc", "ground"],
  transistors: ["nmos", "op_amp"],
};

export default svgComponents;
