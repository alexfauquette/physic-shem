import React, { useRef, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm.js";

import { roughComponents } from "../components";
import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";

const mapStateToProps = (state) => {
  return {
    components: state.components,
    coordinates: state.coordinates,
  };
};

const margin = 50;
const RoughDrawing = ({ components, coordinates }) => {
  const canvasRef = useRef();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [canvasURL, setCanvasURL] = useState();

  useEffect(() => {
    const svgBBox = document.getElementById("drawingArea").getBBox();
    setWidth(svgBBox.width);
    setHeight(svgBBox.height);

    // const rc = rough.canvas(canvasRef.current);
    const rc = rough.canvas(document.getElementById("rough-canvas"));
    const ctx = document.getElementById("rough-canvas").getContext("2d");

    ctx.font = "0.7cm Computer Modern";

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width + 2 * margin, height + 2 * margin);
    ctx.fillStyle = "black";

    components.allIds.forEach((id) => {
      const element = components.byId[id];
      element.positionCoords = element.position
        ? coordinates.byId[element.position]
        : undefined;
      element.fromCoords = element.from
        ? coordinates.byId[element.from]
        : undefined;
      element.toCoords = element.to ? coordinates.byId[element.to] : undefined;

      roughComponents(rc, ctx, svgBBox.x - margin, svgBBox.y - margin, element);
    });
  }, [width, height, components]);

  useEffect(() => {
    setCanvasURL(
      canvasRef.current
        .toDataURL("image/jpg")
        .replace("image/png", "image/octet-stream")
    );
  }, [canvasRef.current]);

  return (
    <>
      <DialogTitle>Image Generator</DialogTitle>
      <DialogContent>
        <canvas
          id="rough-canvas"
          ref={canvasRef}
          width={width + 2 * margin}
          height={height + 2 * margin}
        />
      </DialogContent>
      <DialogActions>
        <Button
          href={canvasURL}
          download="circuit.png"
          variant="contained"
          color="primary"
        >
          Download
        </Button>
      </DialogActions>
    </>
  );
};
export default connect(mapStateToProps)(RoughDrawing);
