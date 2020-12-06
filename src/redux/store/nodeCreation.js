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
    const positionId = uuid();

    const newWeakLink = [];

    if (state.currentMagnet.attractor && state.currentMagnet.attracted) {
      // node created relatively to an anchor
      // We will link this anchor to the new node
      const anchorId =
        state.currentMagnet.attracted.type === "ANCHOR"
          ? state.currentMagnet.attracted.id
          : state.currentMagnet.attractor.id;
      const anchorName =
        state.currentMagnet.attracted.type === "ANCHOR"
          ? state.currentMagnet.attractor.name
          : state.currentMagnet.attracted.name;

      newWeakLink.push({ anchorId, nodeId: newId_element, name: anchorName });
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
      anchors: {
        ...state.anchors,
        byId: {
          ...state.anchors.byId,
          [positionId]: {
            id: positionId,
            x: state.newNode.position.x,
            y: state.newNode.position.y,
            isNodePosition: true,
          },
        },
      },
      weakLinks: [...state.weakLinks, ...newWeakLink],
    };
  }
  return state;
};
