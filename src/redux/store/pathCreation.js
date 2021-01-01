import { getAdhesivePoints, isAnchor } from "./utils";
import { defaultCurrant } from "./debugInitialState";
import { MODE_CREATE_PATH_ELEMENT } from "./interactionModes";

import { v4 as uuid } from "uuid";

export const startCreatePathElement = (state, action) => {
  return {
    ...state,
    selection: [],
    adhesivePoints: [...getAdhesivePoints(action.elementType)],
    mode: MODE_CREATE_PATH_ELEMENT,
    newPath: {
      ...state.newPath,
      elementType: action.elementType,
      isFromValidated: false,
    },
  };
};

export const validateFirstStepPathElement = (state, action) => {
  return {
    ...state,
    newPath: {
      ...state.newPath,
      attractorFrom: state.currentMagnet.attractor && {
        ...state.currentMagnet.attractor,
      },
      to: { x: null, y: null },
      attractorTo: null,
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
        attractorFrom: state.newPath.attractorTo && {
          ...state.newPath.attractorTo,
        },
        to: { x: null, y: null },
        attractorTo: null,
        isFromValidated: false,
      },
    };
  } else {
    return state;
  }
};

export const savePathElement = (state, action) => {
  const attractorTo = state.currentMagnet.attractor && {
    ...state.currentMagnet.attractor,
  };
  const { attractorFrom, from, to, elementType } = state.newPath;

  const newId_element = uuid();

  const fromAnchor =
    attractorFrom && attractorFrom.type === "ANCHOR"
      ? attractorFrom.id
      : uuid();
  const toAnchor =
    attractorTo && attractorTo.type === "ANCHOR" ? attractorTo.id : uuid();

  // create anchors if necessary
  let newAnchors = { ...state.anchors };
  if (!attractorFrom || attractorFrom.type !== "ANCHOR") {
    newAnchors = {
      byId: {
        ...newAnchors.byId,
        [fromAnchor]: {
          id: fromAnchor,
          x: from.x,
          y: from.y,
        },
      },
      allIds: [...newAnchors.allIds, fromAnchor],
    };
  }
  if (!attractorTo || attractorTo.type !== "ANCHOR") {
    newAnchors = {
      byId: {
        ...newAnchors.byId,
        [toAnchor]: {
          id: toAnchor,
          x: to.x,
          y: to.y,
        },
      },
      allIds: [...newAnchors.allIds, toAnchor],
    };
  }

  // create weak links if necessary
  const newWeakLinks = [];
  if (attractorFrom && attractorFrom.type === "NODE") {
    newWeakLinks.push({
      anchorId: fromAnchor,
      nodeId: attractorFrom.id,
      name: attractorFrom.name,
    });
  }
  if (attractorTo && attractorTo.type === "NODE") {
    newWeakLinks.push({
      anchorId: toAnchor,
      nodeId: attractorTo.id,
      name: attractorTo.name,
    });
  }

  return {
    ...state,
    currentMagnet: {
      ...state.currentMagnet,
      attractor: {
        type: "ANCHOR",
        id: toAnchor,
      },
    },
    newPath: {
      ...state.newPath,
      isFromValidated: false,
      from: {
        ...to,
      },
      to: {
        x: null,
        y: null,
      },
    },
    components: {
      byId: {
        ...state.components.byId,
        [newId_element]: {
          id: newId_element,
          from: fromAnchor,
          to: toAnchor,
          type: elementType,
          currant: defaultCurrant,
          label: "",
          annotation: "",
          mirror: false,
          invert: false,
        },
      },
      allIds: [...state.components.allIds, newId_element],
    },
    anchors: { ...newAnchors },
    weakLinks: [...state.weakLinks, ...newWeakLinks],
  };
};

export const updatePosition = (state, action) => {
  const { x, y, shiftPress } = action;

  if (state.newPath.isFromValidated) {
    if (shiftPress) {
      const { x: xFrom, y: yFrom } = state.newPath.from;
      if (Math.abs(x - xFrom) > Math.abs(y - yFrom)) {
        return {
          ...state,
          newPath: {
            ...state.newPath,
            to: { x: x, y: yFrom },
            movedAfterFromCreation: true,
          },
        };
      } else {
        return {
          ...state,
          newPath: {
            ...state.newPath,
            to: { x: xFrom, y: y },
            movedAfterFromCreation: true,
          },
        };
      }
    }
    return {
      ...state,
      newPath: {
        ...state.newPath,
        to: { x: x, y: y },
        movedAfterFromCreation: true,
      },
    };
  } else {
    return {
      ...state,
      newPath: {
        ...state.newPath,
        from: { x: x, y: y },
      },
    };
  }
};
