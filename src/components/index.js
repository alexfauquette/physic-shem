import React from "react";
import Lampe from "./Lampe";
import EmptyDiode from "./empty_diode";
import PR, { getAnchor as pR_getAnchor } from "./pR";
import NMOS, { getAnchor as nmos_getAnchor } from "./nmos";

const getAnchors = {
  lampe: () => [],
  "empty led": () => [],
  pR: (props) => pR_getAnchor(props),
  nmos: (props) => nmos_getAnchor(props),
};

export const getElementAnchors = (element) => {
  return getAnchors[element.type](element);
};

export const isPath = {
  lampe: true,
  "empty led": true,
  pR: true,
  nmos: false,
};

export default {
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
  pR: (props) => <PR key={props.id} {...props} />,
  nmos: (props) => <NMOS key={props.id} {...props} />,
};
