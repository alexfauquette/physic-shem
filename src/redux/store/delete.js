import { componentUseThisAnchor } from "./utils";

const deleteElement = (state, action) => {
  const selection = action.selection;

  const componentIdsToRemove = state.components.allIds.filter((id) =>
    selection.includes(id)
  );

  const componentIdsToKeep = state.components.allIds.filter(
    (id) => !selection.includes(id)
  );

  const coordinateToRemove = [];

  componentIdsToRemove.forEach((componentId) => {
    const anchorToChange = ["from", "to", "position"]
      .map((arg) => state.components.byId[componentId][arg])
      .filter((id) => !!id);

    // get the list of of ids of coordinates that are not anymore used by components
    anchorToChange
      .filter((anchorId) => {
        return (
          componentIdsToKeep.filter((elementId) =>
            componentUseThisAnchor(state.components.byId[elementId], anchorId)
          ).length === 0
        );
      })
      .forEach((idToRemove) => coordinateToRemove.push(idToRemove));
  });

  const newState = {
    ...state,
    components: {
      byId: { ...state.components.byId },
      allIds: [...componentIdsToKeep],
    },
    coordinates: {
      byId: { ...state.coordinates.byId },
      allIds: [
        ...state.coordinates.allIds.filter(
          (id) => !coordinateToRemove.includes(id)
        ),
      ],
    },
    weakLinks: [
      ...state.weakLinks.filter(
        ({ anchorId, nodeId, name }) =>
          !componentIdsToRemove.includes(nodeId) &&
          !coordinateToRemove.includes(anchorId)
      ),
    ],
  };
  componentIdsToRemove.forEach((id) => delete newState.components.byId[id]);
  coordinateToRemove.forEach((id) => delete newState.coordinates.byId[id]);

  return {
    ...newState,
  };
};

export default deleteElement;
