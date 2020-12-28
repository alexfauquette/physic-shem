import React, { useRef, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm.js";

import { roughComponents } from "../components";
import { connect } from "react-redux";

const mapStateToProps = (state) => {
  return {
    pathComponents: state.pathComponents,
    anchors: state.anchors,
  };
};

const margin = 50;
const RoughDrawing = ({ pathComponents, anchors }) => {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const svgBBox = document.getElementById("drawingArea").getBBox();
    setWidth(svgBBox.width);
    setHeight(svgBBox.height);

    // const rc = rough.canvas(canvasRef.current);
    const rc = rough.canvas(document.getElementById("rough-canvas"));
    pathComponents.allIds.forEach((id) => {
      const element = pathComponents.byId[id];
      element.positionCoords = element.position
        ? anchors.byId[element.position]
        : undefined;
      element.fromCoords = element.from
        ? anchors.byId[element.from]
        : undefined;
      element.toCoords = element.to ? anchors.byId[element.to] : undefined;

      roughComponents(rc, svgBBox.x - margin, svgBBox.y - margin, element);
    });
  }, [width, height, pathComponents]);
  return (
    <>
      <canvas
        id="rough-canvas"
        ref={canvasRef}
        width={width + 2 * margin}
        height={height + 2 * margin}
      />
    </>
  );
};
export default connect(mapStateToProps)(RoughDrawing);
