export const START_DRAGGING_ANCHOR = "START_DRAGGING_ANCHOR";
export function startDragginAnchor(anchorId) {
  return {
    type: START_DRAGGING_ANCHOR,
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
