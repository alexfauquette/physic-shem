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
  console.log(objectId);
  return {
    type: TOGGLE_SELECTION,
    objectId,
  };
}
