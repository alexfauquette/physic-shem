import { MODE_CREATE_NODE_ELEMENT } from "./interactionModes";

import { getAdhesivePoints } from "./utils";

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
    const newId_anchor = uuid();

    let newAnchors = state.anchors;
    if (
      state.newNode.position.id === null ||
      !state.anchors.allIds.includes(state.newNode.position.id)
    ) {
      newAnchors = {
        byId: {
          ...state.anchors.byId,
          [newId_anchor]: {
            id: newId_anchor,
            x: state.newNode.position.x,
            y: state.newNode.position.y,
          },
        },
        allIds: [...state.anchors.allIds, newId_anchor],
      };
    }

    const positionId =
      state.newNode.position.id &&
      state.anchors.allIds.includes(state.newNode.position.id)
        ? state.newNode.position.id
        : newId_anchor;

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
