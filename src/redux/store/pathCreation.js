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
  const newId_anchor_from = uuid();
  const newId_anchor_to = uuid();

  let newAnchors = { ...state.anchors };

  if (
    !isAnchor(state, state.newPath.from.id) &&
    isAnchor(state, state.newPath.to.id)
  ) {
    newAnchors = {
      byId: {
        ...state.anchors.byId,
        [newId_anchor_from]: {
          id: newId_anchor_from,
          x: state.newPath.from.x,
          y: state.newPath.from.y,
        },
      },
      allIds: [...state.anchors.allIds, newId_anchor_from],
    };
  } else if (
    !isAnchor(state, state.newPath.to.id) &&
    isAnchor(state, state.newPath.from.id)
  ) {
    newAnchors = {
      byId: {
        ...state.anchors.byId,
        [newId_anchor_to]: {
          id: newId_anchor_to,
          x: state.newPath.to.x,
          y: state.newPath.to.y,
        },
      },
      allIds: [...state.anchors.allIds, newId_anchor_to],
    };
  } else if (
    !isAnchor(state, state.newPath.from.id) &&
    !isAnchor(state, state.newPath.to.id)
  ) {
    newAnchors = {
      byId: {
        ...state.anchors.byId,
        [newId_anchor_from]: {
          id: newId_anchor_from,
          x: state.newPath.from.x,
          y: state.newPath.from.y,
        },
        [newId_anchor_to]: {
          id: newId_anchor_to,
          x: state.newPath.to.x,
          y: state.newPath.to.y,
        },
      },
      allIds: [...state.anchors.allIds, newId_anchor_from, newId_anchor_to],
    };
  }
  return {
    ...state,
    newPath: {
      ...state.newPath,
      isFromValidated: false,
      from: {
        ...state.newPath.to,
        id: isAnchor(state, state.newPath.to.id)
          ? state.newPath.to.id
          : newId_anchor_to,
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
          from: isAnchor(state, state.newPath.from.id)
            ? state.newPath.from.id
            : newId_anchor_from,
          to: isAnchor(state, state.newPath.to.id)
            ? state.newPath.to.id
            : newId_anchor_to,
          type: state.newPath.elementType,
        },
      },
      allIds: [...state.pathComponents.allIds, newId_element],
    },
    anchors: { ...newAnchors },
  };
};
