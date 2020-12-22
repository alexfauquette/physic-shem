import { MODE_CREATE_NODE_ELEMENT } from "./interactionModes";

import { getAdhesivePoints, isAnchor } from "./utils";

import { v4 as uuid } from "uuid";

export const updatePosition = (state, action) => {
  const { x, y } = action;
  return {
    ...state,
    newNode: {
      ...state.newNode,
      position: { x: x, y: y },
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
      position: { x: null, y: null },
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
      if (state.currentMagnet.attractor.type === "ANCHOR") {
        newWeakLink.push({
          anchorId: state.currentMagnet.attractor.id,
          nodeId: newId_element,
          name: state.currentMagnet.attracted.name,
        });
      }
      if (state.currentMagnet.attractor.type === "NODE") {
        newWeakLink.push({
          anchorId: positionId,
          nodeId: state.currentMagnet.attractor.id,
          name: state.currentMagnet.attractor.name,
          nameAnchor: state.currentMagnet.attracted.name,
        });
      }
    }

    return {
      ...state,
      newNode: {
        ...state.newNode,
        position: { x: null, y: null },
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
            nodeId: newId_element,
          },
        },
      },
      weakLinks: [...state.weakLinks, ...newWeakLink],
    };
  }
  return state;
};
