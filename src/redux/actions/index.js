export const START_DRAGGING = "START_DRAGGING";
export function startDraggin(anchorId) {
  return {
    type: START_DRAGGING,
    anchorId: anchorId,
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
