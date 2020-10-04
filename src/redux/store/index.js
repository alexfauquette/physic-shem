import { createStore } from "redux";
import {
  ADD_ELEMENT,
  START_ADDING_ELEMENT,
  NO_STATE,
  START_DRAGGING,
  SELECT_ELEMENT,
  STOP_DRAGGING,
  START_LINKING,
  STOP_LINKING,
  TOGGLE_LINK_STEP,
} from "../actions";
import { v4 as uuid } from "uuid";

export const MODE_ADD = "MODE_ADD";
export const MODE_SELECT = "MODE_SELECT";
export const MODE_DRAG = "MODE_DRAG";
export const MODE_LINK = "MODE_LINK";

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
};

function counter(state = initial_state, action) {
  switch (action.type) {
    case ADD_ELEMENT:
      return {
        ...state,
        mode: MODE_ADD,
        scene: [
          ...state.scene,
          {
            id: uuid(),
            x: action.x,
            y: action.y,
            type: state.selection[0],
          },
        ],
      };
    case START_ADDING_ELEMENT:
      return { ...state, mode: MODE_ADD, selection: [action.elementType] };
    case NO_STATE:
      return { ...state, mode: MODE_SELECT, selection: [] };
    case START_DRAGGING:
      return { ...state, mode: MODE_DRAG };
    case SELECT_ELEMENT:
      if (
        !action.objectId ||
        (state.selection.includes(action.objectId) && !action.ctrlPressed)
      ) {
        return { ...state, mode: MODE_SELECT, selection: [] };
      }
      if (state.selection.includes(action.objectId) && action.ctrlPressed) {
        return {
          ...state,
          mode: MODE_SELECT,
          selection: state.selection.filter((id) => id !== action.objectId),
        };
      }
      return {
        ...state,
        mode: MODE_SELECT,
        selection: action.ctrlPressed
          ? [...state.selection, action.objectId]
          : [action.objectId],
      };
    case STOP_DRAGGING:
      if (action.dx && action.dx) {
        return {
          ...state,
          mode: MODE_SELECT,
          scene: state.scene.map((element) =>
            state.selection.includes(element.id)
              ? {
                  ...element,
                  x: element.x + action.dx,
                  y: element.y + action.dy,
                }
              : { ...element }
          ),
        };
      }
      return { ...state, mode: MODE_SELECT };
    case START_LINKING:
      return {
        ...state,
        mode: MODE_LINK,
        selection: [],
        currentLink: [{ id: action.objectId, x: action.x, y: action.y }],
      };
    case STOP_LINKING:
      if (
        state.currentLink &&
        state.currentLink.length > 0 &&
        state.currentLink[0].objectId !== action.objectId
      ) {
        return {
          ...state,
          mode: MODE_SELECT,
          currentLink: [],
          links: [
            ...state.links,
            {
              id: uuid(),
              listOfPoints: [
                ...state.currentLink.map(({ x, y }) => ({ x, y })),
                { x: action.x, y: action.y },
              ],
            },
          ],
        };
      } else {
        return {
          ...state,
          currentLink: [],
          mode: MODE_SELECT,
        };
      }
    case TOGGLE_LINK_STEP:
      const correspondingIndex = state.currentLink.findIndex(
        (point) => point.id === action.stepId
      );
      if (correspondingIndex < 0) {
        return {
          ...state,
          currentLink: [
            ...state.currentLink,
            { id: action.stepId, x: action.x, y: action.y },
          ],
        };
      } else if (correspondingIndex === state.currentLink.length - 1) {
        return {
          ...state,
          currentLink: state.currentLink.slice(0, state.currentLink.length - 1),
        };
      } else {
        return state;
      }
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

export default store;
