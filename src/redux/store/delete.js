import { componentUseThisAnchor } from "./utils";

const deleteElement = (state, action) => {
  const selection = action.selection;
  if (
    selection.length === 1 &&
    state.components.allIds.includes(selection[0])
  ) {
    // we only consider the deletion of a component (not coordinates)
    const componentId = selection[0];

    const anchorToChange = ["from", "to", "position"]
      .map((arg) => state.components.byId[componentId][arg])
      .filter((id) => !!id);

    // get the list of of ids of coordinates that are not anymore used by components
    const anchorToRemove = anchorToChange.filter((anchorId) => {
      return (
        state.components.allIds.filter((elementId) =>
          componentUseThisAnchor(state.components.byId[elementId], anchorId)
        ).length === 1
      );
    });

    const newAnchors = { ...state.coordinates.byId };
    anchorToRemove.forEach((id) => delete newAnchors[id]);

    const newComponents = { ...state.components.byId };
    delete newComponents[componentId];
    return {
      ...state,
      components: {
        allIds: [...state.components.allIds.filter((id) => id !== componentId)],
        byId: { ...newComponents },
      },
      coordinates: {
        byId: { ...newAnchors },
        allIds: [
          ...state.coordinates.allIds.filter(
            (id) => !anchorToRemove.includes(id)
          ),
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
