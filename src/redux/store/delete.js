import { componentUseThisAnchor } from "./utils";

const deleteElement = (state, action) => {
  const selection = action.selection;
  if (
    selection.length === 1 &&
    state.components.allIds.includes(selection[0])
  ) {
    // we only consider the deletion of a component (not anchors)
    const componentId = selection[0];

    const anchorToChange = ["from", "to", "position"]
      .map((arg) => state.components.byId[componentId][arg])
      .filter((id) => !!id);

    // get the list of of ids of anchors that are not anymore used by components
    const anchorToRemove = anchorToChange.filter((anchorId) => {
      return (
        state.components.allIds.filter((elementId) =>
          componentUseThisAnchor(state.components.byId[elementId], anchorId)
        ).length === 1
      );
    });

    const newAnchors = { ...state.anchors.byId };
    anchorToRemove.forEach((id) => delete newAnchors[id]);

    const newComponents = { ...state.components.byId };
    delete newComponents[componentId];
    return {
      ...state,
      components: {
        allIds: [...state.components.allIds.filter((id) => id !== componentId)],
        byId: { ...newComponents },
      },
      anchors: {
        byId: { ...newAnchors },
        allIds: [
          ...state.anchors.allIds.filter((id) => !anchorToRemove.includes(id)),
        ],
      },
      weakLinks: [
        ...state.weakLinks.filter(
          ({ anchorId, nodeId, name }) =>
            nodeId !== componentId && !anchorToRemove.includes(anchorId)
        ),
      ],
    };
  } else {
    return state;
  }
};

export default deleteElement;
