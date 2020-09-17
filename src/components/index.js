import React from "react";
import Lampe from "./Lampe";
import Resistance from "./Resistance";

export default {
  lampe: (props) => <Lampe key={props.id} {...props} />,
  resistance: (props) => <Resistance key={props.id} {...props} />,
};
