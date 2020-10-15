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
