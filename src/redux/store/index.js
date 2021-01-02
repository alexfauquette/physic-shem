import { createStore } from "redux";

import reducer_displayOptions from "./displayOptions";
import reducer_magnetsOptions from "./magnetsOptions";

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
  UPDATE_COMPONENT,
} from "redux/actions";

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
  rotateNode,
} from "./nodeCreation";

import { stackAnchors, splitAnchor } from "./anchorHelper";
import { MULTIPLICATIVE_CONST } from "utils";

function update(state = initial_state, action) {
  state = { ...reducer_displayOptions(state, action) };
  state = { ...reducer_magnetsOptions(state, action) };

  switch (action.type) {
    case UPDATE_COMPONENT:
      const { id, name, value } = action;
      if (state.components.allIds.includes(id)) {
        if (name === "angle") {
          return rotateNode(state, action);
        }
        return {
          ...state,
          components: {
            ...state.components,
            byId: {
              ...state.components.byId,
              [id]: {
                ...state.components.byId[id],
                [name]: value,
              },
            },
          },
        };
      }
      if (state.coordinates.allIds.includes(id)) {
        return {
          ...state,
          coordinates: {
            ...state.coordinates,
            byId: {
              ...state.coordinates.byId,
              [id]: {
                ...state.coordinates.byId[id],
                [name]: value,
              },
            },
          },
        };
      }
      return state;
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
      const { attractor, attracted } = action;

      if (attractor === null && state.magnetsOptions.isGridAttracting) {
        // if not already attracted by someone check the grid attraction

        const { x, y } = action;

        const refSpace = MULTIPLICATIVE_CONST * state.magnetsOptions.gridSpace;

        if (
          state.mode === MODE_CREATE_PATH_ELEMENT ||
          state.mode === MODE_CREATE_NODE_ELEMENT
        ) {
          const modX = Math.abs(x) % refSpace;
          const modY = Math.abs(y) % refSpace;

          const R = 10;
          if (
            (modX <= R || modX >= refSpace - R) &&
            (modY <= R || modY >= refSpace - R)
          ) {
            action.x = refSpace * Math.round(x / refSpace);
            action.y = refSpace * Math.round(y / refSpace);
          }
        } else if (state.mode === MODE_DRAG) {
          state.adhesivePoints.forEach(({ dx, dy }) => {
            const xToTest = x - dx;
            const yToTest = y - dy;

            const modX = Math.abs(xToTest) % refSpace;
            const modY = Math.abs(yToTest) % refSpace;

            const R = 10;
            if (
              (modX <= R || modX >= refSpace - R) &&
              (modY <= R || modY >= refSpace - R)
            ) {
              action.x =
                x - (xToTest - refSpace * Math.round(xToTest / refSpace));
              action.y =
                y - (yToTest - refSpace * Math.round(yToTest / refSpace));
            }
          });
        }
      }
      switch (state.mode) {
        case MODE_DRAG:
          return {
            ...draggingUpdatePosition(state, action),
            currentMagnet: { attractor, attracted },
          };

        case MODE_CREATE_PATH_ELEMENT:
          return {
            ...pathCreationUpdatePosition(state, action),
            currentMagnet: { attractor, attracted },
          };

        case MODE_CREATE_NODE_ELEMENT:
          return {
            ...nodeCreationUpdatePosition(state, action),
            currentMagnet: { attractor, attracted },
          };

        case MODE_RECTANGLE_SELECTION:
          return {
            ...rectangleSelectionUpdatePosition(state, action),
            currentMagnet: { attractor, attracted },
          };

        default:
          return {
            ...state,
            currentMagnet: { attractor, attracted },
          };
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
