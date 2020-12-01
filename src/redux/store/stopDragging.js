import { MODE_SELECT } from "./interactionModes";
import { replaceComponentAnchor } from "./utils";

const stopDragging = (state, action) => {
  if (
    action.attractor &&
    action.attracted &&
    action.attracted.type === "ANCHOR" &&
    action.attractor.type === "ANCHOR"
  ) {
    // we need to fusion those anchors
    const anchorToRemoveID = action.attracted.id;
    const anchorToUseId = action.attractor.id;

    // remove anchor
    const anchorToRemoveIDIndex = state.anchors.allIds.findIndex(
      (id) => id === anchorToRemoveID
    );
    const {
      [anchorToRemoveID]: anchorToRemove,
      ...remainingAnchors
    } = state.anchors.byId;

    //const update elements
    const newByIDElements = {};
    state.pathComponents.allIds.forEach((id) => {
      newByIDElements[id] = replaceComponentAnchor(
        state.pathComponents.byId[id],
        anchorToRemoveID,
        anchorToUseId
      );
    });

    return {
      ...state,
      anchors: {
        byId: { ...remainingAnchors },
        allIds: [
          ...state.anchors.allIds.slice(0, anchorToRemoveIDIndex),
          ...state.anchors.allIds.slice(anchorToRemoveIDIndex + 1),
        ],
      },
      pathComponents: {
        ...state.pathComponents,
        byId: { ...newByIDElements },
      },
      mode: MODE_SELECT,
      anchorsToMove: [],
      originalPosition: {},
      alreadyMoved: {},
    };
  }

  return {
    ...state,
    mode: MODE_SELECT,
    anchorsToMove: [],
    originalPosition: {},
    alreadyMoved: {},
  };
};

export default stopDragging;
