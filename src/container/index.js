import React from "react";
import { connect } from "react-redux";
import components from "../components";
import ToolBar from "./toolbar";

import {
  updatePosition,
  stopDragging,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
  startMovePaper,
} from "../redux/actions";
import {
  MODE_DRAG,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_SELECT,
  MODE_RECTANGLE_SELECTION,
  MODE_MOVE_PAPER,
} from "../redux/store/interactionModes";

import { MULTIPLICATIVE_CONST } from "../components/constantes";

import Components from "./components";
import Anchors from "./anchors";
import Magnets from "./magnets";

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
    startMovePaper: (x, y) => dispatch(startMovePaper(x, y)),
  };
};
const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    newPath: state.newPath,
    newNode: state.newNode,
    rectangleSelection: state.rectangleSelection,
    displayOptions: state.displayOptions,
    isGridAttracting: state.magnetsOptions.isGridAttracting,
    gridSpace: state.magnetsOptions.gridSpace,
  };
};

const Container = ({
  svgRef,
  mode,
  newPath,
  newNode,
  rectangleSelection,
  displayOptions,
  isGridAttracting,
  gridSpace,
  stopDragging,
  updatePosition,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
  startMovePaper,
}) => {
  const {
    x: SVG_X,
    y: SVG_Y,
    width: SVG_WIDTH,
    height: SVG_HEIGHT,
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
      <ToolBar />
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
        <defs>
          <pattern
            id="grid-magnets"
            x="-10"
            y="-10"
            width={gridSpace * MULTIPLICATIVE_CONST}
            height={gridSpace * MULTIPLICATIVE_CONST}
            patternUnits="userSpaceOnUse"
          >
            <circle fill="gray" cx="10" cy="10" r="3"></circle>
          </pattern>
        </defs>
        {isGridAttracting && (
          <rect
            x={SVG_X - 10}
            y={SVG_Y - 10}
            width="100%"
            height="100%"
            fill="url(#grid-magnets)"
          />
        )}
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
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
