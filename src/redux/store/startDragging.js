import { getElementAnchors } from "../../components";

import { MODE_DRAG } from "./interactionModes";

const startDragging = (state, action) => {
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
    } else if (state.pathComponents.allIds.includes(selectedId)) {
      const anchors = getElementAnchors({
        ...state.pathComponents.byId[selectedId],
        fromCoords:
          state.pathComponents.byId[selectedId].from &&
          state.anchors.byId[state.pathComponents.byId[selectedId].from],
        toCoords:
          state.pathComponents.byId[selectedId].to &&
          state.anchors.byId[state.pathComponents.byId[selectedId].to],
        positionCoords:
          state.pathComponents.byId[selectedId].position &&
          state.anchors.byId[state.pathComponents.byId[selectedId].position],
      });
      anchors.forEach(({ x, y, name }) => {
        if (
          !(
            state.pathComponents.byId[selectedId].positionAnchor &&
            name === state.pathComponents.byId[selectedId].positionAnchor
          )
        ) {
          // if the anchor is not the one giving the position
          adhesivePoints.push({
            type: "COMPONENT", // TODO use constant file
            name: name,
            id: selectedId,
            dx: action.x - x,
            dy: action.y - y,
          });
        }
      });
      if (
        state.pathComponents.byId[selectedId].from &&
        adhesivePoints.findIndex(
          (elem) => elem.id === state.pathComponents.byId[selectedId].from
        ) === -1
      ) {
        //the from anchor is new
        const fromId = state.pathComponents.byId[selectedId].from;
        adhesivePoints.push({
          type: "ANCHOR", // TODO use constant file
          id: fromId,
          dx: action.x - state.anchors.byId[fromId].x,
          dy: action.y - state.anchors.byId[fromId].y,
        });
      }
      if (
        state.pathComponents.byId[selectedId].to &&
        adhesivePoints.findIndex(
          (elem) => elem.id === state.pathComponents.byId[selectedId].to
        ) === -1
      ) {
        //the to anchor is new
        const toId = state.pathComponents.byId[selectedId].to;
        adhesivePoints.push({
          type: "ANCHOR",
          id: toId,
          dx: action.x - state.anchors.byId[toId].x,
          dy: action.y - state.anchors.byId[toId].y,
        });
      }
      if (
        state.pathComponents.byId[selectedId].position &&
        adhesivePoints.findIndex(
          (elem) => elem.id === state.pathComponents.byId[selectedId].position
        ) === -1
      ) {
        //the position anchor is new
        const positionId = state.pathComponents.byId[selectedId].position;
        adhesivePoints.push({
          type: "ANCHOR",
          id: positionId,
          dx: action.x - state.anchors.byId[positionId].x,
          dy: action.y - state.anchors.byId[positionId].y,
        });
      }
    }
  });

  state.selection.forEach((selectedId) => {
    if (state.anchors.allIds.includes(selectedId)) {
      if (!anchorsToMove.includes(selectedId)) {
        anchorsToMove.push(selectedId);
      }
    } else if (state.pathComponents.allIds.includes(selectedId)) {
      if (
        state.pathComponents.byId[selectedId].from &&
        !anchorsToMove.includes(state.pathComponents.byId[selectedId].from)
      ) {
        anchorsToMove.push(state.pathComponents.byId[selectedId].from);
      }
      if (
        state.pathComponents.byId[selectedId].to &&
        !anchorsToMove.includes(state.pathComponents.byId[selectedId].to)
      ) {
        anchorsToMove.push(state.pathComponents.byId[selectedId].to);
      }
      if (
        state.pathComponents.byId[selectedId].position &&
        !anchorsToMove.includes(state.pathComponents.byId[selectedId].position)
      ) {
        anchorsToMove.push(state.pathComponents.byId[selectedId].position);
      }
    }
  });
  return {
    ...state,
    mode: MODE_DRAG,
    anchorsToMove: [...anchorsToMove],
    adhesivePoints: [...adhesivePoints],
    originalPosition: { x: action.x, y: action.y },
    alreadyMoved: { x: 0, y: 0 },
  };
};

export default startDragging;
