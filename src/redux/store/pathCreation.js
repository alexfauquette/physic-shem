import { getAdhesivePoints, isAnchor } from "./utils";

import { MODE_CREATE_PATH_ELEMENT } from "./interactionModes";

import { v4 as uuid } from "uuid";

export const startCreatePathElement = (state, action) => {
  return {
    ...state,
    selection: [],
    adhesivePoints: [...getAdhesivePoints(action.elementType)],
    mode: MODE_CREATE_PATH_ELEMENT,
    newPath: {
      elementType: action.elementType,
      isFromValidated: false,
      from: { x: null, y: null, id: null },
      to: { x: null, y: null, id: null },
    },
  };
};

export const validateFirstStepPathElement = (state, action) => {
  return {
    ...state,
    newPath: {
      ...state.newPath,
      to: { x: null, y: null, id: null },
      isFromValidated: true,
      movedAfterFromCreation: false,
    },
  };
};

export const invalidateFirstStepPathElement = (state, action) => {
  if (state.newPath.movedAfterFromCreation && state.newPath.isFromValidated) {
    return {
      ...state,
      newPath: {
        ...state.newPath,
        from: { ...state.newPath.to },
        to: { x: null, y: null, id: null },
        isFromValidated: false,
      },
    };
  } else {
    return state;
  }
};

export const savePathElement = (state, action) => {
  const newId_element = uuid();

  const fromAnchor = isAnchor(state, state.newPath.from.id)
    ? state.newPath.from.id
    : uuid();
  const toAnchor = isAnchor(state, state.newPath.to.id)
    ? state.newPath.to.id
    : uuid();

  let newAnchors = { ...state.anchors };

  if (!isAnchor(state, state.newPath.from.id)) {
    newAnchors = {
      byId: {
        ...newAnchors.byId,
        [fromAnchor]: {
          id: fromAnchor,
          x: state.newPath.from.x,
          y: state.newPath.from.y,
        },
      },
      allIds: [...newAnchors.allIds, fromAnchor],
    };
  }
  if (!isAnchor(state, state.newPath.to.id)) {
    newAnchors = {
      byId: {
        ...newAnchors.byId,
        [toAnchor]: {
          id: toAnchor,
          x: state.newPath.to.x,
          y: state.newPath.to.y,
        },
      },
      allIds: [...newAnchors.allIds, toAnchor],
    };
  }

  return {
    ...state,
    newPath: {
      ...state.newPath,
      isFromValidated: false,
      from: {
        ...state.newPath.to,
        id: toAnchor,
      },
      to: {
        x: null,
        y: null,
        id: null,
      },
    },
    pathComponents: {
      byId: {
        ...state.pathComponents.byId,
        [newId_element]: {
          id: newId_element,
          from: fromAnchor,
          to: toAnchor,
          type: state.newPath.elementType,
        },
      },
      allIds: [...state.pathComponents.allIds, newId_element],
    },
    anchors: { ...newAnchors },
  };
};

export const updatePosition = (state, action) => {
  const { x, y, id } = action;
  if (state.newPath.isFromValidated) {
    return {
      ...state,
      newPath: {
        ...state.newPath,
        to: { x: x, y: y, id: id },
        movedAfterFromCreation: true,
      },
    };
  } else {
    return {
      ...state,
      newPath: {
        ...state.newPath,
        from: { x: x, y: y, id: id },
      },
    };
  }
};
