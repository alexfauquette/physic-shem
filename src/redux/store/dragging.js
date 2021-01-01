import { getElementAnchors } from "../../components";

import { replaceComponentAnchor } from "./utils";

import { MODE_DRAG, MODE_SELECT } from "./interactionModes";

export const startDragging = (state, action) => {
  const coordinatesToMove = [];
  const adhesivePoints = [];

  state.selection.forEach((selectedId) => {
    if (state.coordinates.allIds.includes(selectedId)) {
      if (adhesivePoints.findIndex((elem) => elem.id === selectedId) === -1) {
        adhesivePoints.push({
          type: "ANCHOR",
          id: selectedId,
          dx: action.x - state.coordinates.byId[selectedId].x,
          dy: action.y - state.coordinates.byId[selectedId].y,
        });
      }
    } else if (state.components.allIds.includes(selectedId)) {
      const coordinates = getElementAnchors({
        ...state.components.byId[selectedId],
        fromCoords:
          state.components.byId[selectedId].from &&
          state.coordinates.byId[state.components.byId[selectedId].from],
        toCoords:
          state.components.byId[selectedId].to &&
          state.coordinates.byId[state.components.byId[selectedId].to],
        positionCoords:
          state.components.byId[selectedId].position &&
          state.coordinates.byId[state.components.byId[selectedId].position],
      });

      coordinates.forEach(({ x, y, name }) => {
        adhesivePoints.push({
          type: state.components.byId[selectedId].position ? "NODE" : "PATH", // TODO use constant file
          name: name,
          id: selectedId,
          dx: action.x - x,
          dy: action.y - y,
        });
      });
      if (
        state.components.byId[selectedId].from &&
        adhesivePoints.findIndex(
          (elem) => elem.id === state.components.byId[selectedId].from
        ) === -1
      ) {
        //the from anchor is new
        const fromId = state.components.byId[selectedId].from;
        adhesivePoints.push({
          type: "ANCHOR", // TODO use constant file
          id: fromId,
          dx: action.x - state.coordinates.byId[fromId].x,
          dy: action.y - state.coordinates.byId[fromId].y,
        });
      }
      if (
        state.components.byId[selectedId].to &&
        adhesivePoints.findIndex(
          (elem) => elem.id === state.components.byId[selectedId].to
        ) === -1
      ) {
        //the to anchor is new
        const toId = state.components.byId[selectedId].to;
        adhesivePoints.push({
          type: "ANCHOR",
          id: toId,
          dx: action.x - state.coordinates.byId[toId].x,
          dy: action.y - state.coordinates.byId[toId].y,
        });
      }
    }
  });

  const pile = [...state.selection];
  const nodeSeen = [];
  while (pile.length > 0) {
    const selectedId = pile.pop();
    if (state.components.allIds.includes(selectedId)) {
      if (
        state.components.byId[selectedId].from &&
        !coordinatesToMove.includes(state.components.byId[selectedId].from)
      ) {
        coordinatesToMove.push(state.components.byId[selectedId].from);
      }
      if (
        state.components.byId[selectedId].to &&
        !coordinatesToMove.includes(state.components.byId[selectedId].to)
      ) {
        coordinatesToMove.push(state.components.byId[selectedId].to);
      }
      if (state.components.byId[selectedId].position) {
        if (
          !coordinatesToMove.includes(
            state.components.byId[selectedId].position
          )
        ) {
          pile.push(state.components.byId[selectedId].position);
        }
        if (!nodeSeen.includes(selectedId)) {
          nodeSeen.push(selectedId);
          state.weakLinks.forEach(({ anchorId, nodeId }) => {
            if (
              nodeId === selectedId &&
              !coordinatesToMove.includes(anchorId)
            ) {
              pile.push(anchorId);
            }
          });
        }
      }
    } else {
      if (!coordinatesToMove.includes(selectedId)) {
        coordinatesToMove.push(selectedId);

        if (state.coordinates.byId[selectedId].isNodePosition) {
          pile.push(state.coordinates.byId[selectedId].nodeId);
        }
      }
    }
  }

  return {
    ...state,
    mode: MODE_DRAG,
    coordinatesToMove: [...coordinatesToMove],
    adhesivePoints: [...adhesivePoints],
    originalPosition: { x: action.x, y: action.y },
    alreadyMoved: { x: 0, y: 0 },
    weakLinksToRemove: [
      ...state.weakLinks
        .filter(
          ({ anchorId, nodeId }) =>
            coordinatesToMove.includes(anchorId) &&
            !coordinatesToMove.includes(state.components.byId[nodeId].position)
        )
        .map(({ anchorId, nodeId }) => anchorId + "-" + nodeId),
    ],
  };
};

export const stopDragging = (state, action) => {
  if (
    state.currentMagnet.attractor &&
    state.currentMagnet.attracted &&
    state.currentMagnet.attracted.type === "ANCHOR" &&
    state.currentMagnet.attractor.type === "ANCHOR"
  ) {
    // we need to fusion those coordinates
    const anchorToRemoveID = state.currentMagnet.attracted.id;
    const anchorToUseId = state.currentMagnet.attractor.id;

    // remove anchor
    const anchorToRemoveIDIndex = state.coordinates.allIds.findIndex(
      (id) => id === anchorToRemoveID
    );
    const {
      [anchorToRemoveID]: anchorToRemove,
      ...remainingAnchors
    } = state.coordinates.byId;

    //const update elements
    const newByIDElements = {};
    state.components.allIds.forEach((id) => {
      newByIDElements[id] = replaceComponentAnchor(
        state.components.byId[id],
        anchorToRemoveID,
        anchorToUseId
      );
    });

    return {
      ...state,
      coordinates: {
        byId: { ...remainingAnchors },
        allIds: [
          ...state.coordinates.allIds.slice(0, anchorToRemoveIDIndex),
          ...state.coordinates.allIds.slice(anchorToRemoveIDIndex + 1),
        ],
      },
      components: {
        ...state.components,
        byId: { ...newByIDElements },
      },
      mode: MODE_SELECT,
      coordinatesToMove: [],
      originalPosition: {},
      alreadyMoved: {},
      weakLinksToRemove: [],
      weakLinks: [
        ...state.weakLinks.filter(
          ({ anchorId, nodeId }) =>
            !state.weakLinksToRemove.includes(anchorId + "-" + nodeId)
        ),
      ],
    };
  }

  if (
    state.currentMagnet.attractor &&
    state.currentMagnet.attracted &&
    state.currentMagnet.attracted.type !== "PATH" &&
    state.currentMagnet.attractor.type !== "PATH"
  ) {
    const newWeakLink = [];

    if (
      state.currentMagnet.attracted.type === "NODE" &&
      state.currentMagnet.attractor.type === "NODE"
    ) {
      newWeakLink.push({
        anchorId:
          state.components.byId[state.currentMagnet.attracted.id].position,
        nodeId: state.currentMagnet.attractor.id,
        name: state.currentMagnet.attractor.name,
        nameAnchor: state.currentMagnet.attracted.name,
      });
    } else {
      const nodeId =
        state.currentMagnet.attracted.type === "NODE"
          ? state.currentMagnet.attracted.id
          : state.currentMagnet.attractor.id;
      const anchorId =
        state.currentMagnet.attracted.type === "ANCHOR"
          ? state.currentMagnet.attracted.id
          : state.currentMagnet.attractor.id;
      const name =
        state.currentMagnet.attracted.type === "NODE"
          ? state.currentMagnet.attracted.name
          : state.currentMagnet.attractor.name;

      newWeakLink.push({
        anchorId: anchorId,
        nodeId: nodeId,
        name: name,
      });
    }
    return {
      ...state,
      mode: MODE_SELECT,
      coordinatesToMove: [],
      originalPosition: {},
      alreadyMoved: {},
      weakLinksToRemove: [],
      weakLinks: [
        ...state.weakLinks.filter(
          ({ anchorId, nodeId }) =>
            !state.weakLinksToRemove.includes(anchorId + "-" + nodeId)
        ),
        ...newWeakLink,
      ],
    };
  }

  return {
    ...state,
    mode: MODE_SELECT,
    coordinatesToMove: [],
    originalPosition: {},
    alreadyMoved: {},

    weakLinksToRemove: [],

    weakLinks: [
      ...state.weakLinks.filter(
        ({ anchorId, nodeId }) =>
          !state.weakLinksToRemove.includes(anchorId + "-" + nodeId)
      ),
    ],
  };
};

export const updatePosition = (state, action) => {
  const { x, y, shiftPress } = action;
  const { x: originalX, y: originalY } = state.originalPosition;

  let newMoveX, newMoveY;
  // if shift is pressed only allow to move along x or y axis
  if (shiftPress) {
    if (Math.abs(x - originalX) > Math.abs(y - originalY)) {
      newMoveX = x - originalX;
      newMoveY = 0;
    } else {
      newMoveX = 0;
      newMoveY = y - originalY;
    }
  } else {
    newMoveX = x - originalX;
    newMoveY = y - originalY;
  }

  const anchorById = state.coordinates.byId;
  state.coordinatesToMove.forEach((anchorId) => {
    anchorById[anchorId] = {
      ...anchorById[anchorId],
      x: anchorById[anchorId].x + newMoveX - state.alreadyMoved.x,
      y: anchorById[anchorId].y + newMoveY - state.alreadyMoved.y,
    };
  });

  return {
    ...state,
    coordinates: {
      ...state.coordinates,
      byId: { ...anchorById },
    },
    alreadyMoved: {
      x: newMoveX,
      y: newMoveY,
    },
  };
};
