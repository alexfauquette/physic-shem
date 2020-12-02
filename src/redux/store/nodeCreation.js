import { MODE_CREATE_NODE_ELEMENT } from "./interactionModes";

import { getAdhesivePoints, isAnchor } from "./utils";

import { v4 as uuid } from "uuid";

export const updatePosition = (state, action) => {
  const { x, y, id } = action;
  return {
    ...state,
    newNode: {
      ...state.newNode,
      position: { x: x, y: y, id: id },
    },
  };
};

export const startNodeCreation = (state, action) => {
  return {
    ...state,
    selection: [],
    adhesivePoints: [...getAdhesivePoints(action.elementType)],
    mode: MODE_CREATE_NODE_ELEMENT,
    newNode: {
      elementType: action.elementType,
      position: { x: null, y: null, id: null },
    },
  };
};

export const saveNodeCreation = (state, action) => {
  if (
    state.mode === MODE_CREATE_NODE_ELEMENT &&
    state.newNode.position.x !== null &&
    state.newNode.position.y !== null
  ) {
    const newId_element = uuid();

    const newAnchors = { ...state.anchors };

    const positionId = isAnchor(state, state.newNode.position.id)
      ? state.newNode.position.id
      : uuid();

    if (!isAnchor(state, state.newNode.position.id)) {
      // add the new anchor if necessary
      newAnchors.byId = {
        ...state.anchors.byId,
        [positionId]: {
          id: positionId,
          x: state.newNode.position.x,
          y: state.newNode.position.y,
        },
      };
      newAnchors.allIds = [...state.anchors.allIds, positionId];
    }

    return {
      ...state,
      newNode: {
        ...state.newNode,
        position: { x: null, y: null, id: null },
      },
      pathComponents: {
        byId: {
          ...state.pathComponents.byId,
          [newId_element]: {
            id: newId_element,
            position: positionId,
            type: state.newNode.elementType,
          },
        },
        allIds: [...state.pathComponents.allIds, newId_element],
      },
      anchors: { ...newAnchors },
    };
  }
  return state;
};
