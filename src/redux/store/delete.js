import { componentUseThisAnchor } from "./utils";

const deleteElement = (state, action) => {
  const selection = action.selection;
  if (
    selection.length === 1 &&
    state.pathComponents.allIds.includes(selection[0])
  ) {
    const componentId = selection[0];

    const anchorToChange = ["from", "to", "position"]
      .map((arg) => state.pathComponents.byId[componentId][arg])
      .filter((id) => !!id);

    const anchorToRemove = anchorToChange.filter((anchorId) => {
      return (
        state.pathComponents.allIds.filter((elementId) =>
          componentUseThisAnchor(state.pathComponents.byId[elementId], anchorId)
        ).length === 1
      );
    });

    const newAnchors = { ...state.anchors.byId };
    anchorToRemove.forEach((id) => delete newAnchors[id]);

    const {
      [componentId]: toRemove,
      ...newPathComponents
    } = state.pathComponents.byId;
    return {
      ...state,
      pathComponents: {
        allIds: [
          ...state.pathComponents.allIds.filter((id) => id !== componentId),
        ],
        byId: { ...newPathComponents },
      },
      anchors: {
        byId: { ...newAnchors },
        allIds: [
          ...state.anchors.allIds.filter((id) => !anchorToRemove.includes(id)),
        ],
      },
    };
  } else {
    return state;
  }
};

export default deleteElement;
