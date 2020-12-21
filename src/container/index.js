import React, { useRef, useState } from "react";
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
} from "../redux/actions";
import {
  MODE_DRAG,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_SELECT,
  MODE_RECTANGLE_SELECTION,
} from "../redux/store/interactionModes";

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
  };
};
const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    newPath: state.newPath,
    newNode: state.newNode,
    rectangleSelection: state.rectangleSelection,
  };
};

const Container = ({
  mode,
  newPath,
  newNode,
  rectangleSelection,
  stopDragging,
  updatePosition,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
}) => {
  const svgRef = useRef();

  const followMouse = (event) => {
    const { x: xOffset, y: yOffset } = svgRef.current.getBoundingClientRect();

    switch (mode) {
      case MODE_DRAG:
      case MODE_CREATE_PATH_ELEMENT:
      case MODE_CREATE_NODE_ELEMENT:
      case MODE_RECTANGLE_SELECTION:
        updatePosition(
          event.nativeEvent.clientX - xOffset,
          event.nativeEvent.clientY - yOffset,
          event.shiftKey
        );
        break;
      default:
        break;
    }
  };

  const click = (event) => {
    const { x: xOffset, y: yOffset } = svgRef.current.getBoundingClientRect();

    switch (mode) {
      case MODE_SELECT:
        event.stopPropagation();
        startRectangleSelection(
          event.nativeEvent.clientX - xOffset,
          event.nativeEvent.clientY - yOffset
        );
        break;
      case MODE_CREATE_PATH_ELEMENT:
        event.stopPropagation();
        if (newPath.isFromValidated) {
          savePathElementCreation(
            event.nativeEvent.clientX - xOffset,
            event.nativeEvent.clientY - yOffset
          );
        } else {
          validateFirstStepPathElementCreation();
        }
        break;
      case MODE_CREATE_NODE_ELEMENT:
        event.stopPropagation();
        nextStepOfElementCreation();
        break;
      default:
        break;
    }
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        style={{ width: 1000, height: 600, background: "lightgray" }}
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
        <Components svgRef={svgRef} />

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

        <Anchors svgRef={svgRef} />
        <Magnets svgRef={svgRef} />

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
