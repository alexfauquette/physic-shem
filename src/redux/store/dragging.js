import { getElementAnchors } from "../../components";

import { replaceComponentAnchor } from "./utils";

import { MODE_DRAG, MODE_SELECT } from "./interactionModes";

export const startDragging = (state, action) => {
  const anchorsToMove = [];
  const adhesivePoints = [];

  state.selection.forEach((selectedId) => {
    if (state.anchors.allIds.includes(selectedId)) {
      if (adhesivePoints.findIndex((elem) => elem.id === selectedId) === -1) {
        adhesivePoints.push({
          type: "ANCHOR",
          id: selectedId,
          dx: action.x - state.anchors.byId[selectedId].x,
          dy: action.y - state.anchors.byId[selectedId].y,
        });
      }
    } else if (state.components.allIds.includes(selectedId)) {
      const anchors = getElementAnchors({
        ...state.components.byId[selectedId],
        fromCoords:
          state.components.byId[selectedId].from &&
          state.anchors.byId[state.components.byId[selectedId].from],
        toCoords:
          state.components.byId[selectedId].to &&
          state.anchors.byId[state.components.byId[selectedId].to],
        positionCoords:
          state.components.byId[selectedId].position &&
          state.anchors.byId[state.components.byId[selectedId].position],
      });

      anchors.forEach(({ x, y, name }) => {
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
          dx: action.x - state.anchors.byId[fromId].x,
          dy: action.y - state.anchors.byId[fromId].y,
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
          dx: action.x - state.anchors.byId[toId].x,
          dy: action.y - state.anchors.byId[toId].y,
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
        !anchorsToMove.includes(state.components.byId[selectedId].from)
      ) {
        anchorsToMove.push(state.components.byId[selectedId].from);
      }
      if (
        state.components.byId[selectedId].to &&
        !anchorsToMove.includes(state.components.byId[selectedId].to)
      ) {
        anchorsToMove.push(state.components.byId[selectedId].to);
      }
      if (state.components.byId[selectedId].position) {
        if (
          !anchorsToMove.includes(state.components.byId[selectedId].position)
        ) {
          pile.push(state.components.byId[selectedId].position);
        }
        if (!nodeSeen.includes(selectedId)) {
          nodeSeen.push(selectedId);
          state.weakLinks.forEach(({ anchorId, nodeId }) => {
            if (nodeId === selectedId && !anchorsToMove.includes(anchorId)) {
              pile.push(anchorId);
            }
          });
        }
      }
    } else {
      if (!anchorsToMove.includes(selectedId)) {
        anchorsToMove.push(selectedId);

        if (state.anchors.byId[selectedId].isNodePosition) {
          pile.push(state.anchors.byId[selectedId].nodeId);
        }
      }
    }
  }

  return {
    ...state,
    mode: MODE_DRAG,
    anchorsToMove: [...anchorsToMove],
    adhesivePoints: [...adhesivePoints],
    originalPosition: { x: action.x, y: action.y },
    alreadyMoved: { x: 0, y: 0 },
    weakLinksToRemove: [
      ...state.weakLinks
        .filter(
          ({ anchorId, nodeId }) =>
            anchorsToMove.includes(anchorId) &&
            !anchorsToMove.includes(state.components.byId[nodeId].position)
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
    // we need to fusion those anchors
    const anchorToRemoveID = state.currentMagnet.attracted.id;
    const anchorToUseId = state.currentMagnet.attractor.id;

    // remove anchor
    const anchorToRemoveIDIndex = state.anchors.allIds.findIndex(
      (id) => id === anchorToRemoveID
    );
    const {
      [anchorToRemoveID]: anchorToRemove,
      ...remainingAnchors
    } = state.anchors.byId;

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
      anchors: {
        byId: { ...remainingAnchors },
        allIds: [
          ...state.anchors.allIds.slice(0, anchorToRemoveIDIndex),
          ...state.anchors.allIds.slice(anchorToRemoveIDIndex + 1),
        ],
      },
      components: {
        ...state.components,
        byId: { ...newByIDElements },
      },
      mode: MODE_SELECT,
      anchorsToMove: [],
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
      anchorsToMove: [],
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
    anchorsToMove: [],
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

  const anchorById = state.anchors.byId;
  state.anchorsToMove.forEach((anchorId) => {
    anchorById[anchorId] = {
      ...anchorById[anchorId],
      x: anchorById[anchorId].x + newMoveX - state.alreadyMoved.x,
      y: anchorById[anchorId].y + newMoveY - state.alreadyMoved.y,
    };
  });

  return {
    ...state,
    anchors: {
      ...state.anchors,
      byId: { ...anchorById },
    },
    alreadyMoved: {
      x: newMoveX,
      y: newMoveY,
    },
  };
};
