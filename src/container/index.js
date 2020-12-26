import React from "react";
import { connect } from "react-redux";
import components from "../components";
import {
  updatePosition,
  stopDragging,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
  setZoom,
  startMovePaper,
  setModeMovePaper,
  startSelect,
  stackSelectedAnchors,
  updateMagnetOption,
} from "../redux/actions";
import {
  MODE_DRAG,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_SELECT,
  MODE_RECTANGLE_SELECTION,
  MODE_MOVE_PAPER,
} from "../redux/store/interactionModes";

import Components from "./components";
import Anchors from "./anchors";
import Magnets from "./magnets";

import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

const mapDispatchToProps = (dispatch) => {
  return {
    updatePosition: (x, y, shiftPress) =>
      dispatch(updatePosition({ x, y, shiftPress })),
    stopDragging: () => dispatch(stopDragging()),
    validateFirstStepPathElementCreation: () =>
      dispatch(validateFirstStepPathElementCreation()),
    invalidateFirstStepPathElementCreation: () =>
      dispatch(invalidateFirstStepPathElementCreation()),
    savePathElementCreation: () => dispatch(savePathElementCreation()),
    nextStepOfElementCreation: () => dispatch(nextStepOfElementCreation()),
    startRectangleSelection: (x, y) => dispatch(startRectangleSelection(x, y)),
    stopRectangleSelection: () => dispatch(stopRectangleSelection()),
    setZoom: (zoom) => dispatch(setZoom(zoom)),
    startMovePaper: (x, y) => dispatch(startMovePaper(x, y)),
    setModeMovePaper: () => dispatch(setModeMovePaper()),
    startSelect: () => dispatch(startSelect()),
    stackSelectedAnchors: (direction) =>
      dispatch(stackSelectedAnchors(direction)),
    updateMagnetOption: (optionName, optionValue = null) =>
      dispatch(updateMagnetOption(optionName, optionValue)),
  };
};
const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    newPath: state.newPath,
    newNode: state.newNode,
    rectangleSelection: state.rectangleSelection,
    displayOptions: state.displayOptions,
    magnetsOptions: state.magnetsOptions,
  };
};

const Container = ({
  svgRef,
  mode,
  newPath,
  newNode,
  rectangleSelection,
  displayOptions,
  stopDragging,
  updatePosition,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
  setZoom,
  startMovePaper,
  setModeMovePaper,
  startSelect,
  stackSelectedAnchors,
  updateMagnetOption,
  magnetsOptions,
}) => {
  const {
    x: SVG_X,
    y: SVG_Y,
    width: SVG_WIDTH,
    height: SVG_HEIGHT,
    zoom,
  } = displayOptions;

  const followMouse = (event) => {
    const {
      x: xOffset,
      y: yOffset,
      width: svgWidth,
      height: svgHeight,
    } = svgRef.current.getBoundingClientRect();

    switch (mode) {
      case MODE_DRAG:
      case MODE_CREATE_PATH_ELEMENT:
      case MODE_CREATE_NODE_ELEMENT:
      case MODE_RECTANGLE_SELECTION:
        updatePosition(
          SVG_X +
            (event.nativeEvent.clientX - xOffset) * (SVG_WIDTH / svgWidth),
          SVG_Y +
            (event.nativeEvent.clientY - yOffset) * (SVG_HEIGHT / svgHeight),
          event.shiftKey
        );
        break;
      default:
        break;
    }
  };

  const click = (event) => {
    const {
      x: xOffset,
      y: yOffset,
      width: svgWidth,
      height: svgHeight,
    } = svgRef.current.getBoundingClientRect();

    switch (mode) {
      case MODE_SELECT:
        event.stopPropagation();
        startRectangleSelection(
          SVG_X +
            (event.nativeEvent.clientX - xOffset) * (SVG_WIDTH / svgWidth),
          SVG_Y +
            (event.nativeEvent.clientY - yOffset) * (SVG_HEIGHT / svgHeight)
        );
        break;
      case MODE_CREATE_PATH_ELEMENT:
        event.stopPropagation();
        if (newPath.isFromValidated) {
          savePathElementCreation(
            SVG_X +
              (event.nativeEvent.clientX - xOffset) * (SVG_WIDTH / svgWidth),
            SVG_Y +
              (event.nativeEvent.clientY - yOffset) * (SVG_HEIGHT / svgHeight)
          );
        } else {
          validateFirstStepPathElementCreation();
        }
        break;
      case MODE_CREATE_NODE_ELEMENT:
        event.stopPropagation();
        nextStepOfElementCreation();
        break;
      case MODE_MOVE_PAPER:
        event.stopPropagation();
        startMovePaper(event.nativeEvent.clientX, event.nativeEvent.clientY);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {/* TODO create a clean toolbar */}
      <IconButton
        color={mode === MODE_MOVE_PAPER ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          if (mode === MODE_MOVE_PAPER) {
            startSelect();
          } else {
            setModeMovePaper();
          }
        }}
      >
        <ControlCameraIcon />
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          setZoom(zoom / 2);
        }}
      >
        <ZoomOutIcon />
      </IconButton>
      {zoom}
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          setZoom(zoom * 2);
        }}
      >
        <ZoomInIcon />
      </IconButton>
      |
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("L");
        }}
      >
        <SvgIcon>
          <path d="M22 13V19H6V13H22M6 5V11H16V5H6M2 2V22H4V2H2" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("R");
        }}
      >
        <SvgIcon>
          <path d="M18 13V19H2V13H18M8 5V11H18V5H8M20 2V22H22V2H20Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("D");
        }}
      >
        <SvgIcon>
          <path d="M11 22H5V6H11V22M19 6H13V16H19V6M22 2H2V4H22V2Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("U");
        }}
      >
        <SvgIcon>
          <path d="M11 18H5V2H11V18M19 8H13V18H19V8M22 20H2V22H22V20Z" />
        </SvgIcon>
      </IconButton>
      |
      <IconButton
        color={magnetsOptions.isGridAttracting ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isGridAttracting");
        }}
      >
        <SvgIcon>
          <path d="M0 6v1h24v-1ZM0 12v1h24v-1ZM0 18v1h24v-1Z" />
          <path d="M4 0h1v24h-1ZM11 0h1v24h-1ZM18 0h1v24h-1Z" />
          <circle cx={18.5} cy={18.5} r={3} />
        </SvgIcon>
      </IconButton>
      <Select
        value={magnetsOptions.gridSpace}
        onChange={(event) =>
          updateMagnetOption("gridSpace", event.target.value)
        }
      >
        <MenuItem value={0.5}>0.5</MenuItem>
        <MenuItem value={1}>1</MenuItem>
        <MenuItem value={2}>2</MenuItem>
      </Select>
      <IconButton
        color={
          magnetsOptions.isPathCoordinatesAttracting ? "secondary" : "default"
        }
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isPathCoordinatesAttracting");
        }}
      >
        <SvgIcon>
          <path d="M4 11.5h20v1h-20Z" />

          <circle cx={2} cy={12} r={2} />
          <circle cx={22} cy={12} r={2} />
        </SvgIcon>
      </IconButton>
      <IconButton
        color={magnetsOptions.isNodeAnchorsAttracting ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isNodeAnchorsAttracting");
        }}
      >
        <SvgIcon>
          <path d="M4 11.5h20v10h-20v-10M8 13h10v5h-10Z" />

          <circle cx={2} cy={12} r={2} />
          <circle cx={22} cy={12} r={2} />
        </SvgIcon>
      </IconButton>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`${SVG_X} ${SVG_Y} ${SVG_WIDTH} ${SVG_HEIGHT}`}
        style={{ width: "100%", background: "lightgray" }}
        onMouseMove={
          mode === MODE_DRAG ||
          mode === MODE_CREATE_PATH_ELEMENT ||
          mode === MODE_CREATE_NODE_ELEMENT ||
          mode === MODE_RECTANGLE_SELECTION
            ? followMouse
            : null
        }
        onMouseDown={click}
        onMouseUp={
          mode === MODE_DRAG
            ? () => stopDragging()
            : mode === MODE_RECTANGLE_SELECTION
            ? (event) => {
                event.stopPropagation();
                stopRectangleSelection();
              }
            : null
        }
        ref={svgRef}
      >
        <Components svgRef={svgRef} displayOptions={displayOptions} />

        {/* display the path element in during its creation */}

        {mode === MODE_CREATE_PATH_ELEMENT && // the element
          newPath &&
          newPath.isFromValidated &&
          newPath.to &&
          newPath.to.x !== null &&
          newPath.to.y !== null &&
          newPath.from &&
          newPath.from.x !== null &&
          newPath.from.y !== null &&
          components[newPath.elementType]({
            fromCoords: newPath.from,
            toCoords: newPath.to,
          })}
        {mode === MODE_CREATE_PATH_ELEMENT && //the anchor TO
          newPath &&
          newPath.isFromValidated &&
          newPath.to.x !== null &&
          newPath.to.y !== null && (
            <circle cx={newPath.to.x} cy={newPath.to.y} r={5} />
          )}
        {mode === MODE_CREATE_PATH_ELEMENT && // the anchor FROM
          newPath &&
          newPath.from &&
          newPath.from.x !== null &&
          newPath.from.y !== null && (
            <circle
              cx={newPath.from.x}
              cy={newPath.from.y}
              r={5}
              onMouseEnter={invalidateFirstStepPathElementCreation}
            />
          )}

        {/* display the path element in during its creation */}

        {mode === MODE_CREATE_NODE_ELEMENT && // the element
          newNode &&
          newNode.position &&
          newNode.position.x !== null &&
          newNode.position.y !== null &&
          components[newNode.elementType]({
            positionCoords: newNode.position,
          })}
        {mode === MODE_CREATE_NODE_ELEMENT && // the anchor POSITION
          newNode &&
          newNode.position &&
          newNode.position.x !== null &&
          newNode.position.y !== null && (
            <circle cx={newNode.position.x} cy={newNode.position.y} r={5} />
          )}

        <Anchors svgRef={svgRef} displayOptions={displayOptions} />
        <Magnets svgRef={svgRef} displayOptions={displayOptions} />

        {mode === MODE_RECTANGLE_SELECTION && (
          <path
            d={`M ${rectangleSelection.x0} ${rectangleSelection.y0} L  ${rectangleSelection.x0} ${rectangleSelection.y1} L ${rectangleSelection.x1} ${rectangleSelection.y1} L  ${rectangleSelection.x1} ${rectangleSelection.y0} Z`}
            style={{ fill: "transparent", stroke: "red", strokeWidth: 1 }}
          />
        )}
      </svg>
      {/* <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 210 297`}
        style={{
          width: "210px",
          height: "297px",
          background: "gray",
          position: "absolute",
          bottom: "10px",
          left: "200px",
        }}
      >
        <rect x="10" y="20" width="20" height="30" style={{ fill: "white" }} />
      </svg> */}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
