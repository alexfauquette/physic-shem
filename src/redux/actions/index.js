export const START_DRAGGING = "START_DRAGGING";
export function startDragging(x, y) {
  return {
    type: START_DRAGGING,
    x,
    y,
  };
}

export const STOP_DRAGGING = "STOP_DRAGGING";
export function stopDragging() {
  return {
    type: STOP_DRAGGING,
  };
}

export const UPDATE_POSITION = "UPDATE_POSITION";
export function updatePosition({ x, y, id, shiftPress }) {
  return {
    type: UPDATE_POSITION,
    x,
    y,
    id: id || null,
    shiftPress,
  };
}

export const START_SELECT = "START_SELECT";
export function startSelect() {
  return {
    type: START_SELECT,
  };
}

export const TOGGLE_SELECTION = "TOGGLE_SELECTION";
export function toggleSelection(objectId, reset) {
  return {
    type: TOGGLE_SELECTION,
    objectId,
    reset,
  };
}

export const START_CREATE_ANCHOR = "START_CREATE_ANCHOR";
export function startCreateAnchor() {
  return {
    type: START_CREATE_ANCHOR,
  };
}

export const SAVE_ANCHOR_CREATION = "SAVE_ANCHOR_CREATION";
export function saveAnchorCreation() {
  return {
    type: SAVE_ANCHOR_CREATION,
  };
}

export const START_CREATE_PATH_ELEMENT = "START_CREATE_PATH_ELEMENT";
export function startCreatePathElement(elementType) {
  return {
    type: START_CREATE_PATH_ELEMENT,
    elementType,
  };
}

export const UPDATE_ELEMENT_CREATION = "UPDATE_ELEMENT_CREATION";
export function updateElementCreation(x, y, id) {
  return {
    type: UPDATE_ELEMENT_CREATION,
    x,
    y,
    id: id || null,
  };
}

export const VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION =
  "VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION";
export function validateFirstStepPathElementCreation() {
  return {
    type: VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION,
  };
}

export const INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION =
  "INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION";
export function invalidateFirstStepPathElementCreation() {
  return {
    type: INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION,
  };
}

export const SAVE_PATH_ELEMENT_CREATION = "SAVE_PATH_ELEMENT_CREATION";
export function savePathElementCreation() {
  return {
    type: SAVE_PATH_ELEMENT_CREATION,
  };
}

export const START_CREATE_NODE_ELEMENT = "START_CREATE_NODE_ELEMENT";
export function startCreateNodeElement(elementType) {
  return {
    type: START_CREATE_NODE_ELEMENT,
    elementType,
  };
}

export const ELEMENT_CREATION_NEXT_STEP = "ELEMENT_CREATION_NEXT_STEP";
export function nextStepOfElementCreation() {
  return {
    type: ELEMENT_CREATION_NEXT_STEP,
  };
}
