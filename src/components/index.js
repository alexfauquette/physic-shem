import React from "react";
import Lampe from "./Lampe";
import EmptyDiode from "./empty_diode";
import PR from "./pR";
import NMOS from "./nmos";

export default {
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
  pR: (props) => <PR key={props.id} {...props} />,
  nmos: (props) => <NMOS key={props.id} {...props} />,
};
