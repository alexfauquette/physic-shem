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

export const ANCHOR_MOVE = "ANCHOR_MOVE";
export function anchorMove(x, y, shiftPress) {
  return {
    type: ANCHOR_MOVE,
    x,
    y,
    shiftPress: shiftPress,
  };
}

export const START_SELECT = "START_SELECT";
export function startSelect() {
  return {
    type: START_SELECT,
  };
}

export const TOGGLE_SELECTION = "TOGGLE_SELECTION";
export function toggleSelection(objectId) {
  return {
    type: TOGGLE_SELECTION,
    objectId,
  };
}

export const START_CREATE_ANCHOR = "START_CREATE_ANCHOR";
export function startCreateAnchor() {
  return {
    type: START_CREATE_ANCHOR,
  };
}

export const UPDATE_ANCHOR_CREATION = "UPDATE_ANCHOR_CREATION";
export function updateAnchorCreation(x, y, id) {
  return {
    type: UPDATE_ANCHOR_CREATION,
    x,
    y,
    id: id || null,
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

export const UPDATE_PATH_ELEMENT_CREATION = "UPDATE_PATH_ELEMENT_CREATION";
export function updatePathElementCreation(x, y, id) {
  return {
    type: UPDATE_PATH_ELEMENT_CREATION,
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
