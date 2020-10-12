import React from "react";
import Lampe from "./Lampe";

export default {
  lampe: (props) => <Lampe key={props.id} {...props} />,
};
