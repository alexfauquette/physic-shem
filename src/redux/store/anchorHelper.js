import { componentUseThisAnchor, replaceComponentAnchor } from "./utils";

import { v4 as uuid } from "uuid";

export const stackAnchors = (state, action) => {
  const anchorsSelected = state.selection.filter(
    (id) => id in state.anchors.byId
  );
  if (
    anchorsSelected.length <= 1 ||
    !["U", "D", "L", "R"].includes(action.direction)
  ) {
    return state;
  } else {
    const newPosition = {};

    anchorsSelected.forEach((id, index) => {
      const anchor = state.anchors.byId[id];

      switch (action.direction) {
        case "U":
          newPosition.y =
            index === 0 ? anchor.y : Math.min(newPosition.y, anchor.y);
          break;
        case "D":
          newPosition.y =
            index === 0 ? anchor.y : Math.max(newPosition.y, anchor.y);
          break;
        case "L":
          newPosition.x =
            index === 0 ? anchor.x : Math.min(newPosition.x, anchor.x);
          break;
        case "R":
          newPosition.x =
            index === 0 ? anchor.x : Math.max(newPosition.x, anchor.x);
          break;
        default:
          break;
      }
    });

    anchorsSelected.forEach((id) => {
      state.anchors.byId[id] = {
        ...state.anchors.byId[id],
        ...newPosition,
      };
    });
    return {
      ...state,
      anchors: {
        byId: { ...state.anchors.byId },
        allIds: state.anchors.allIds,
      },
    };
  }
};

export const splitAnchor = (state, action) => {
  let anchorId = action.anchorId;
  if (
    !anchorId &&
    state.selection.length === 1 &&
    state.anchors.allIds.includes(state.selection[0])
  ) {
    anchorId = state.selection[0];
  }
  if (anchorId && state.anchors.allIds.includes(anchorId)) {
    const componentsToChange = state.pathComponents.allIds.filter((id) =>
      componentUseThisAnchor(state.pathComponents.byId[id], anchorId)
    );
    if (componentsToChange.length <= 1) {
      return state;
    }

    const newAnchors = state.anchors;
    const newComponents = state.pathComponents.byId;

    componentsToChange.slice(1).forEach((componentId) => {
      const newAnchorId = uuid();

      newComponents[componentId] = replaceComponentAnchor(
        state.pathComponents.byId[componentId],
        anchorId,
        newAnchorId
      );

      newAnchors.allIds = [newAnchorId, ...newAnchors.allIds];
      newAnchors.byId = {
        ...newAnchors.byId,
        [newAnchorId]: { ...newAnchors.byId[anchorId] },
      };
    });

    return {
      ...state,
      pathComponents: {
        ...state.pathComponents,
        byId: { ...newComponents },
      },
      anchors: {
        allIds: [...newAnchors.allIds],
        byId: { ...newAnchors.byId },
      },
    };
  }
  return state;
};
