export const ADD_ELEMENT = "ADD_ELEMENT";
export function addElement(x, y) {
  return {
    type: ADD_ELEMENT,
    x,
    y,
  };
}

export const START_ADDING_ELEMENT = "START_ADDING_ELEMENT";
export function startAddingElement(elementType) {
  return {
    type: START_ADDING_ELEMENT,
    elementType,
  };
}

export const NO_STATE = "NO_STATE";
export function resetState() {
  return {
    type: NO_STATE,
  };
}

export const START_DRAGGING = "START_DRAGGING";
export function startDragging() {
  return {
    type: START_DRAGGING,
  };
}

export const SELECT_ELEMENT = "SELECT_ELEMENT";
export function selectElement(objectId, ctrlPressed) {
  return {
    type: SELECT_ELEMENT,
    objectId,
    ctrlPressed,
  };
}

export const STOP_DRAGGING = "STOP_DRAGGING";
export function stopDraging(dx, dy) {
  return {
    type: STOP_DRAGGING,
    dx,
    dy,
  };
}

export const START_LINKING = "START_LINKING";
export function startLinking(objectId, x, y) {
  return {
    type: START_LINKING,
    objectId,
    x,
    y,
  };
}

export const STOP_LINKING = "STOP_LINKING";
export function stopLinking(objectId, x, y) {
  return {
    type: STOP_LINKING,
    objectId,
    x,
    y,
  };
}

export const TOGGLE_LINK_STEP = "TOGGLE_LINK_STEP";
export function toggleLinkStep(stepId, x, y) {
  return {
    type: TOGGLE_LINK_STEP,
    stepId,
    x,
    y,
  };
}
