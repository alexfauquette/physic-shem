import { createStore } from "redux";
import { ADD_ELEMENT, START_ADDING_ELEMENT, NO_STATE } from "../actions";
import { v4 as uuid } from "uuid";

export const MODE_ADD = "MODE_ADD";
export const MODE_SELECT = "MODE_SELECT";

const initial_state = {
  mode: null,
  selection: [],
  scene: {},
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
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(counter);

export default store;
