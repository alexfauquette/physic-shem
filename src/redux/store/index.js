import { createStore } from "redux";
import { START_DRAGGING, ANCHOR_MOVE, START_SELECT } from "../actions";
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
        x: 10,
        y: 10,
      },
      anchor2: {
        x: 150,
        y: 30,
      },
      anchor3: {
        x: 100,
        y: 100,
      },
      anchor4: {
        x: 10,
        y: 200,
      },
      anchor5: {
        x: 50,
        y: 200,
      },
      anchor6: {
        x: 100,
        y: 200,
      },
    },
    allIds: ["anchor1", "anchor2", "anchor3", "anchor4", "anchor5", "anchor6"],
  },
};

function counter(state = initial_state, action) {
  switch (action.type) {
    case START_SELECT:
      return {
        ...state,
        selection: [],
        mode: MODE_SELECT,
      };
    case START_DRAGGING:
      return {
        ...state,
        mode: MODE_DRAG,
        selection: [action.anchorId],
        originalPosition: { ...state.anchors.byId[action.anchorId] },
      };

    case ANCHOR_MOVE:
      let newX, newY;
      if (action.shiftPress) {
        if (
          Math.abs(action.x - state.originalPosition.x) >
          Math.abs(action.y - state.originalPosition.y)
        ) {
          newX = action.x;
          newY = state.originalPosition.y;
        } else {
          newX = state.originalPosition.x;
          newY = action.y;
        }
      } else {
        newX = action.x;
        newY = action.y;
      }
      return {
        ...state,
        anchors: {
          ...state.anchors,
          byId: {
            ...state.anchors.byId,
            [state.selection[0]]: {
              ...state.anchors.byId[state.selection[0]],
              x: newX,
              y: newY,
            },
          },
        },
      };
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

export default store;
