import { MODE_CREATE_NODE_ELEMENT } from "./interactionModes";

import { getAdhesivePoints } from "./utils";
import { getElementAnchors, isMultyPole } from "components";

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
      anchorsDelta: getElementAnchors({
        type: action.elementType,
        positionCoords: { x: 0, y: 0 },
      }).map(({ x, y }) => ({ dx: -x, dy: -y })),
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

    return {
      ...state,
      newNode: {
        ...state.newNode,
        position: { x: null, y: null },
      },
      components: {
        byId: {
          ...state.components.byId,
          [newId_element]: {
            id: newId_element,
            position: positionId,
            type: state.newNode.elementType,
            angle: 0,
          },
        },
        allIds: [...state.components.allIds, newId_element],
      },
      coordinates: {
        ...state.coordinates,
        byId: {
          ...state.coordinates.byId,
          [positionId]: {
            id: positionId,
            x: state.newNode.position.x,
            y: state.newNode.position.y,
            isNodePosition: true,
            nodeId: newId_element,
          },
        },
      },
    };
  }
  return state;
};

const newPositions = (coordinates, toUpdate, deltaToAdd) => {
  // this function update coordinates by a delta
  const newAnchors = { ...coordinates };

  toUpdate.forEach(({ anchorId, anchorName }) => {
    newAnchors[anchorId] = {
      ...newAnchors[anchorId],
      x: newAnchors[anchorId].x + deltaToAdd[anchorName].dx,
      y: newAnchors[anchorId].y + deltaToAdd[anchorName].dy,
    };
  });

  return { ...newAnchors };
};

export const rotateNode = (state, { id, value }) => {
  // we prepare data for the update
  // first we get coordinate of coordinates before and after rotation
  const element = state.components.byId[id];

  const positionCoords = state.coordinates.byId[element.position];
  const prevAngle = element.angle;
  const newAngle = value;

  const prevAnchors = getElementAnchors({
    ...element,
    positionCoords: positionCoords,
    angle: prevAngle,
  });
  const newAnchors = getElementAnchors({
    ...element,
    positionCoords: positionCoords,
    angle: newAngle,
  });

  // Now we create a dictionary that for an anchor name return dx and dy the delta modification of the anchor
  const deltaToAdd = {};
  newAnchors.forEach(({ name, x, y }) => {
    deltaToAdd[name] = { dx: x, dy: y };
  });
  prevAnchors.forEach(({ name, x, y }) => {
    deltaToAdd[name].dx -= x;
    deltaToAdd[name].dy -= y;
  });

  if (
    state.rotationHelper &&
    state.rotationHelper.id &&
    state.rotationHelper.id === id
  ) {
    // the id is the same as before So we just need to do the update of coordinates

    return {
      ...state,
      coordinates: {
        ...state.coordinates,
        byId: {
          ...newPositions(
            state.coordinates.byId,
            state.rotationHelper.IdToUpdate,
            deltaToAdd
          ),
        },
      },
      components: {
        ...state.components,
        byId: {
          ...state.components.byId,
          [id]: {
            ...state.components.byId[id],
            angle: newAngle,
          },
        },
      },
    };
  } else {
    const IdToUpdate = [];

    // we will parse weakLinks to know what to update and what to remove
    state.weakLinks.forEach(({ anchorId, nodeId, name }) => {
      if (nodeId === id) {
        // if child is path of mono pole
        IdToUpdate.push({ anchorId, anchorName: name });
      }
    });

    return {
      ...state,
      coordinates: {
        ...state.coordinates,
        byId: {
          ...newPositions(state.coordinates.byId, IdToUpdate, deltaToAdd),
        },
      },
      components: {
        ...state.components,
        byId: {
          ...state.components.byId,
          [id]: {
            ...state.components.byId[id],
            angle: newAngle,
          },
        },
      },
      rotationHelper: {
        IdToUpdate: IdToUpdate,
        id: id,
      },
    };
  }
};
