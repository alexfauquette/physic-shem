import { createStore } from "redux";
import {
  START_DRAGGING,
  START_SELECT,
  TOGGLE_SELECTION,
  STOP_DRAGGING,
  START_CREATE_PATH_ELEMENT,
  START_CREATE_NODE_ELEMENT,
  ELEMENT_CREATION_NEXT_STEP,
  VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION,
  INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION,
  SAVE_PATH_ELEMENT_CREATION,
  UPDATE_POSITION,
  SPLIT_ANCHOR,
  START_RECTANGLE_SELECTION,
  STOP_RECTANGLE_SELECTION,
  STACK_SELECTED_ANCHORS,
  DELETE_ELEMENT,
} from "../actions";

import {
  MODE_SELECT,
  MODE_DRAG,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_RECTANGLE_SELECTION,
} from "./interactionModes";

import { initial_state } from "./debugInitialState";

import {
  startDragging,
  stopDragging,
  updatePosition as draggingUpdatePosition,
} from "./dragging";

import deleteElement from "./delete";
import {
  startCreatePathElement,
  validateFirstStepPathElement,
  invalidateFirstStepPathElement,
  savePathElement,
  updatePosition as pathCreationUpdatePosition,
} from "./pathCreation";

import {
  stopRectangleSelection,
  startRectangleSelection,
  updatePosition as rectangleSelectionUpdatePosition,
} from "./rectangleSelection";

import {
  startNodeCreation,
  saveNodeCreation,
  updatePosition as nodeCreationUpdatePosition,
} from "./nodeCreation";

import { stackAnchors, splitAnchor } from "./anchorHelper";

function update(state = initial_state, action) {
  switch (action.type) {
    case TOGGLE_SELECTION:
      if (action.reset) {
        return {
          ...state,
          selection: [action.objectId],
        };
      } else {
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
      }
    case START_SELECT:
      return {
        ...state,
        selection: [],
        adhesivePoints: [],
        mode: MODE_SELECT,
      };

    case START_DRAGGING:
      return startDragging(state, action);

    case STOP_DRAGGING:
      return stopDragging(state, action);

    case UPDATE_POSITION:
      switch (state.mode) {
        case MODE_DRAG:
          return draggingUpdatePosition(state, action);

        case MODE_CREATE_PATH_ELEMENT:
          return pathCreationUpdatePosition(state, action);

        case MODE_CREATE_NODE_ELEMENT:
          return nodeCreationUpdatePosition(state, action);

        case MODE_RECTANGLE_SELECTION:
          return rectangleSelectionUpdatePosition(state, action);

        default:
          return state;
      }

    case START_CREATE_PATH_ELEMENT:
      return startCreatePathElement(state, action);

    case START_CREATE_NODE_ELEMENT:
      return startNodeCreation(state, action);

    case ELEMENT_CREATION_NEXT_STEP:
      return saveNodeCreation(state, action);

    case VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION:
      return validateFirstStepPathElement(state, action);

    case INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION:
      return invalidateFirstStepPathElement(state, action);

    case SAVE_PATH_ELEMENT_CREATION:
      return savePathElement(state, action);

    case SPLIT_ANCHOR:
      return splitAnchor(state, action);

    case START_RECTANGLE_SELECTION:
      return startRectangleSelection(state, action);

    case STOP_RECTANGLE_SELECTION:
      return stopRectangleSelection(state, action);

    case STACK_SELECTED_ANCHORS:
      return stackAnchors(state, action);

    case DELETE_ELEMENT:
      return deleteElement(state, action);

    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(update);

export default store;
