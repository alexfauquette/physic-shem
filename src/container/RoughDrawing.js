import React, { useRef, useState, useEffect } from "react";
import rough from "roughjs/bundled/rough.esm.js";

import { roughComponents } from "components";
import { roughCoordinate } from "atoms/anchor";

import { connect } from "react-redux";

import Button from "@material-ui/core/Button";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";

import AutorenewIcon from "@material-ui/icons/Autorenew";

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
  const [seed, setSeed] = useState(1);
  const [roughness, setRoughness] = useState(1);

  const [canvasURL, setCanvasURL] = useState();

  useEffect(() => {
    const svgBBox = document.getElementById("drawingArea").getBBox();
    setWidth(svgBBox.width);
    setHeight(svgBBox.height);

    // const rc = rough.canvas(canvasRef.current);
    const rc = rough.canvas(document.getElementById("rough-canvas"), {
      options: { seed: seed, roughness: roughness, curveFitting: 1 },
    });
    const ctx = document.getElementById("rough-canvas").getContext("2d");

    ctx.font = "0.7cm IndieFlower";

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

    coordinates.allIds.forEach((id) => {
      const element = coordinates.byId[id];
      roughCoordinate(rc, ctx, svgBBox.x - margin, svgBBox.y - margin, element);
    });

    setCanvasURL(
      canvasRef.current
        .toDataURL("image/jpg")
        .replace("image/png", "image/octet-stream")
    );
  }, [
    canvasRef.current,
    width,
    height,
    components,
    coordinates,
    seed,
    roughness,
  ]);

  const generateNewDrawing = () => setSeed(seed + 1);
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
        <div>
          <Typography id="roughness-slider" gutterBottom>
            Roughness
          </Typography>
          <Slider
            value={roughness}
            onChange={(event, newValue) => setRoughness(newValue)}
            aria-labelledby="roughness-slider"
            min={0}
            max={5}
            step={0.1}
          />
        </div>
        <Button onClick={generateNewDrawing} variant="outlined">
          <AutorenewIcon />
        </Button>
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
