import { componentUseThisAnchor, replaceComponentAnchor } from "./utils";

import { v4 as uuid } from "uuid";

export const stackAnchors = (state, action) => {
  const anchorsSelected = state.selection.filter(
    (id) => id in state.anchors.byId
  );
  const movedAnchors = [];
  if (
    anchorsSelected.length <= 1 ||
    !["U", "D", "L", "R"].includes(action.direction)
  ) {
    return state;
  } else {
    const newPosition = {};

    // We start by looping on selected element to find the min/max along x/y depending on the letter
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

    // now we now the new x/y we change those positions
    anchorsSelected.forEach((id) => {
      const anchor = state.anchors.byId[id];

      //  if the position is modified we just break all the weak lins associated
      if (
        (newPosition.x !== undefined && newPosition.x !== anchor.x) ||
        (newPosition.y !== undefined && newPosition.y !== anchor.y)
      ) {
        movedAnchors.push(id);
      }

      state.anchors.byId[id] = {
        ...anchor,
        ...newPosition,
      };
    });

    return {
      ...state,
      anchors: {
        ...state.anchors,
        byId: { ...state.anchors.byId },
      },
      weakLinks: [
        ...state.weakLinks.filter(
          ({ anchorId }) => !movedAnchors.includes(anchorId)
        ),
      ],
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
    const newWeakLinks = [];
    const weakLinksToCopy = state.weakLinks.filter(
      ({ anchorId: linkedAnchorId }) => anchorId === linkedAnchorId
    );

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

      weakLinksToCopy.forEach((linkToCopy) => {
        newWeakLinks.push({ ...linkToCopy, anchorId: newAnchorId });
      });
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
      weakLinks: [...state.weakLinks, ...newWeakLinks],
    };
  }
  return state;
};
