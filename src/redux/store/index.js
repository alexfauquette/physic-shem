import { createStore } from "redux";
import {
  START_DRAGGING,
  ANCHOR_MOVE,
  START_SELECT,
  TOGGLE_SELECTION,
  STOP_DRAGGING,
  START_CREATE_ANCHOR,
  UPDATE_ANCHOR_CREATION,
  SAVE_ANCHOR_CREATION,
} from "../actions";

import { v4 as uuid } from "uuid";

export const MODE_SELECT = "MODE_SELECT";
export const MODE_DRAG = "MODE_DRAG";
export const MODE_DELETE = "MODE_DELETE";
export const MODE_SPLIT_ANCHOR = "MODE_SPLIT_ANCHOR";
export const MODE_CREATE_ANCHOR = "MODE_CREATE_ANCHOR";
export const MODE_CREATE_PATH_ELEMENT = "MODE_CREATE_PATH_ELEMENT";

const initial_state = {
  mode: MODE_SELECT,
  selection: [],
  links: [],
  scene: [
    {
      id: uuid(),
      x: 50,
      y: 50,
      type: "lampe",
    },
    {
      id: uuid(),
      x: 150,
      y: 150,
      type: "lampe",
    },
    {
      id: uuid(),
      x: 50,
      y: 150,
      type: "resistance",
    },
  ],
  pathComponents: {
    byId: {
      id1: {
        id: "id1",
        from: "anchor1",
        to: "anchor3",
        type: "lampe",
      },
      id2: {
        id: "id2",
        from: "anchor2",
        to: "anchor3",
        type: "lampe",
      },
      id3: {
        id: "id3",
        from: "anchor4",
        to: "anchor3",
        type: "lampe",
      },
      id4: {
        id: "id4",
        from: "anchor5",
        to: "anchor3",
        type: "lampe",
      },
      id5: {
        id: "id5",
        from: "anchor6",
        to: "anchor3",
        type: "lampe",
      },
    },
    allIds: ["id1", "id2", "id3", "id4", "id5"],
  },
  anchors: {
    byId: {
      anchor1: {
        id: "anchor1",
        x: 10,
        y: 10,
      },
      anchor2: {
        id: "anchor2",
        x: 150,
        y: 30,
      },
      anchor3: {
        id: "anchor3",
        x: 100,
        y: 100,
      },
      anchor4: {
        id: "anchor4",
        x: 10,
        y: 200,
      },
      anchor5: {
        id: "anchor5",
        x: 50,
        y: 200,
      },
      anchor6: {
        id: "anchor6",
        x: 100,
        y: 200,
      },
    },
    allIds: ["anchor1", "anchor2", "anchor3", "anchor4", "anchor5", "anchor6"],
  },
};

function counter(state = initial_state, action) {
  switch (action.type) {
    case TOGGLE_SELECTION:
      const index = state.selection.findIndex((x) => x === action.objectId);
      if (index >= 0) {
        return {
          ...state,
          selection: [
            ...state.selection.slice(0, index),
            ...state.selection.slice(index + 1),
          ],
        };
      } else {
        return {
          ...state,
          selection: [...state.selection, action.objectId],
        };
      }
    case START_SELECT:
      return {
        ...state,
        selection: [],
        mode: MODE_SELECT,
      };
    case START_DRAGGING:
      const anchorsToMove = [];
      state.selection.forEach((selectedId) => {
        if (state.anchors.allIds.includes(selectedId)) {
          if (!anchorsToMove.includes(selectedId)) {
            anchorsToMove.push(selectedId);
          }
        } else if (state.pathComponents.allIds.includes(selectedId)) {
          if (
            !anchorsToMove.includes(state.pathComponents.byId[selectedId].from)
          ) {
            anchorsToMove.push(state.pathComponents.byId[selectedId].from);
          }
          if (
            !anchorsToMove.includes(state.pathComponents.byId[selectedId].to)
          ) {
            anchorsToMove.push(state.pathComponents.byId[selectedId].to);
          }
        }
      });
      return {
        ...state,
        mode: MODE_DRAG,
        anchorsToMove: [...anchorsToMove],
        originalPosition: { x: action.x, y: action.y },
        alreadyMoved: { x: 0, y: 0 },
      };
    case STOP_DRAGGING:
      return {
        ...state,
        mode: MODE_SELECT,
        anchorsToMove: [],
        originalPosition: {},
        alreadyMoved: {},
      };
    case ANCHOR_MOVE:
      let newMoveX, newMoveY;
      if (action.shiftPress) {
        if (
          Math.abs(action.x - state.originalPosition.x) >
          Math.abs(action.y - state.originalPosition.y)
        ) {
          newMoveX = action.x - state.originalPosition.x;
          newMoveY = 0;
        } else {
          newMoveX = 0;
          newMoveY = action.y - state.originalPosition.y;
        }
      } else {
        newMoveX = action.x - state.originalPosition.x;
        newMoveY = action.y - state.originalPosition.y;
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
    case START_CREATE_ANCHOR:
      return {
        ...state,
        selection: [],
        mode: MODE_CREATE_ANCHOR,
        newAnchor: {
          x: null,
          y: null,
          id: null,
        },
      };

    case UPDATE_ANCHOR_CREATION:
      return {
        ...state,
        newAnchor: {
          x: action.x,
          y: action.y,
          id: action.id,
        },
      };
    case SAVE_ANCHOR_CREATION:
      if (state.newAnchor.id == null) {
        const newId = uuid();
        return {
          ...state,
          anchors: {
            byId: {
              ...state.anchors.byId,
              [newId]: {
                ...state.newAnchor,
                id: newId,
              },
            },
            allIds: [...state.anchors.allIds, newId],
          },
          newAnchor: {
            x: action.x,
            y: action.y,
            id: newId,
          },
        };
      }
      return state;
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

export default store;
