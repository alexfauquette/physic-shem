import React from "react";
import Lampe from "./Lampe";
import EmptyDiode from "./empty_diode";

export default {
  lampe: (props) => <Lampe key={props.id} {...props} />,
  "empty led": (props) => <EmptyDiode key={props.id} {...props} />,
};
