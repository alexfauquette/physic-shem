import React from "react";
import { connect } from "react-redux";
import components from "../components";
import {
  updatePosition,
  stopDragging,
  saveAnchorCreation,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
} from "../redux/actions";
import {
  MODE_DRAG,
  MODE_CREATE_ANCHOR,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_SELECT,
  MODE_RECTANGLE_SELECTION,
} from "../redux/store";
import getCircuitikz from "../redux/store/getCircuitikz";

import Components from "./components";
import Anchors from "./anchors";
import Magnets from "./magnets";

const mapDispatchToProps = (dispatch) => {
  return {
    updatePosition: (x, y, shiftPress) =>
      dispatch(updatePosition({ x, y, shiftPress })),
    stopDragging: () => dispatch(stopDragging()),
    saveAnchorCreation: () => dispatch(saveAnchorCreation()),
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
  return { ...state, state: state };
};

const Container = ({
  mode,
  newAnchor,
  newPath,
  newNode,
  rectangleSelection,
  stopDragging,
  updatePosition,
  saveAnchorCreation,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
  startRectangleSelection,
  stopRectangleSelection,
  state,
}) => {
  const followMouse = (event) => {
    switch (mode) {
      case MODE_DRAG:
      case MODE_CREATE_PATH_ELEMENT:
      case MODE_CREATE_NODE_ELEMENT:
      case MODE_RECTANGLE_SELECTION:
        updatePosition(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY,
          event.shiftKey
        );
        break;
      case MODE_CREATE_ANCHOR:
        updatePosition(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY,
          null
        );
        break;
      default:
        break;
    }
  };

  const click = (event) => {
    switch (mode) {
      case MODE_SELECT:
        event.stopPropagation();
        startRectangleSelection(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        );
        break;
      case MODE_CREATE_ANCHOR:
        event.stopPropagation();
        saveAnchorCreation();
        break;
      case MODE_CREATE_PATH_ELEMENT:
        event.stopPropagation();
        if (newPath.isFromValidated) {
          savePathElementCreation(
            event.nativeEvent.offsetX,
            event.nativeEvent.offsetY
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
      <p>{mode}</p>
      <p>{newNode && newNode.from && newNode.elementType}</p>
      <p>{(newPath && newPath.elementType) || "none"}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1000 600"
        style={{ width: 1000, height: 600 }}
        onMouseMove={
          mode === MODE_DRAG ||
          mode === MODE_CREATE_ANCHOR ||
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
      >
        <Components />
        {mode === MODE_CREATE_ANCHOR &&
          newAnchor &&
          newAnchor.x !== null &&
          newAnchor.y !== null && (
            <circle cx={newAnchor.x} cy={newAnchor.y} r={15} />
          )}

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

        <Anchors />
        <Magnets />

        {mode === MODE_RECTANGLE_SELECTION && (
          <path
            d={`M ${rectangleSelection.x0} ${rectangleSelection.y0} L  ${rectangleSelection.x0} ${rectangleSelection.y1} L ${rectangleSelection.x1} ${rectangleSelection.y1} L  ${rectangleSelection.x1} ${rectangleSelection.y0} Z`}
            style={{ fill: "transparent", stroke: "red", strokeWidth: 1 }}
          />
        )}
      </svg>
      <p>
        {getCircuitikz(state).map((line) => (
          <>
            {line}
            <br />
          </>
        ))}
      </p>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
