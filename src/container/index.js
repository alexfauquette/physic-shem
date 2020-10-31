import React from "react";
import { connect } from "react-redux";
import components from "../components";
import {
  updatePosition,
  stopDragging,
  saveAnchorCreation,
  updateElementCreation,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
} from "../redux/actions";
import {
  MODE_DRAG,
  MODE_CREATE_ANCHOR,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
} from "../redux/store";
import Components from "./components";
import Anchors from "./anchors";

const mapDispatchToProps = (dispatch) => {
  return {
    updatePosition: (x, y, shiftPress) =>
      dispatch(updatePosition({ x, y, shiftPress })),
    stopDragging: () => dispatch(stopDragging()),
    saveAnchorCreation: () => dispatch(saveAnchorCreation()),
    updateElementCreation: (x, y) =>
      dispatch(updateElementCreation(x, y, null)),
    validateFirstStepPathElementCreation: () =>
      dispatch(validateFirstStepPathElementCreation()),
    invalidateFirstStepPathElementCreation: () =>
      dispatch(invalidateFirstStepPathElementCreation()),
    savePathElementCreation: () => dispatch(savePathElementCreation()),
    nextStepOfElementCreation: () => dispatch(nextStepOfElementCreation()),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({
  mode,
  newAnchor,
  newPath,
  newNode,
  stopDragging,
  updatePosition,
  saveAnchorCreation,
  updateElementCreation,
  validateFirstStepPathElementCreation,
  invalidateFirstStepPathElementCreation,
  savePathElementCreation,
  nextStepOfElementCreation,
}) => {
  const followMouse = (event) => {
    switch (mode) {
      case MODE_DRAG:
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
      case MODE_CREATE_PATH_ELEMENT:
      case MODE_CREATE_NODE_ELEMENT:
        updateElementCreation(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        );
        break;
      default:
        break;
    }
  };

  const click = (event) => {
    switch (mode) {
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
        viewBox="0 0 500 300"
        style={{ width: 500, height: 300 }}
        onMouseMove={
          mode === MODE_DRAG ||
          mode === MODE_CREATE_ANCHOR ||
          mode === MODE_CREATE_PATH_ELEMENT ||
          mode === MODE_CREATE_NODE_ELEMENT
            ? followMouse
            : null
        }
        onMouseDown={click}
        onMouseUp={mode === MODE_DRAG ? () => stopDragging() : null}
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
      </svg>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
