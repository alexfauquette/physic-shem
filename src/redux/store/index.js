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
};

function counter(state = initial_state, action) {
  switch (action.type) {
    case ADD_ELEMENT:
      return {
        ...state,
        mode: MODE_ADD,
        scene: {
          ...state.scene,
          [uuid()]: {
            x: action.x,
            y: action.y,
            type: state.selection[0],
          },
        },
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
        state.selection.forEach((id) => {
          state.scene[id] = {
            ...state.scene[id],
            x: state.scene[id].x + action.dx,
            y: state.scene[id].y + action.dy,
          };
        });
        return { ...state, mode: MODE_SELECT, scene: state.scene };
      }
      return { ...state, mode: MODE_SELECT };
    case START_LINKING:
      return {
        ...state,
        mode: MODE_LINK,
        selection: [],
        startLink: { id: action.objectId, x: action.x, y: action.y },
      };
    case STOP_LINKING:
      if (state.startLink && state.startLink.objectId !== action.objectId) {
        return {
          ...state,
          mode: MODE_SELECT,
          links: [
            ...state.links,
            {
              id: uuid(),
              listOfPoints: [
                { x: state.startLink.x, y: state.startLink.y },
                { x: action.x, y: action.y },
              ],
            },
          ],
        };
      } else {
        return {
          ...state,
          mode: MODE_SELECT,
        };
      }

    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

export default store;
