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
  getAdhesivePoints,
  componentUseThisAnchor,
  replaceComponentAnchor,
  isInRectangle,
  isAnchor,
} from "./utils";

import { v4 as uuid } from "uuid";

import { initial_state } from "./debugInitialState";
import startDragging from "./startDragging";
import stopDragging from "./stopDragging";
import deleteElement from "./delete";

import {
  MODE_SELECT,
  MODE_DRAG,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_RECTANGLE_SELECTION,
} from "./interactionModes";

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
      const { x, y, id, shiftPress } = action;
      switch (state.mode) {
        case MODE_DRAG:
          let newMoveX, newMoveY;
          if (shiftPress) {
            if (
              Math.abs(x - state.originalPosition.x) >
              Math.abs(y - state.originalPosition.y)
            ) {
              newMoveX = x - state.originalPosition.x;
              newMoveY = 0;
            } else {
              newMoveX = 0;
              newMoveY = y - state.originalPosition.y;
            }
          } else {
            newMoveX = x - state.originalPosition.x;
            newMoveY = y - state.originalPosition.y;
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

        case MODE_CREATE_PATH_ELEMENT:
          if (state.newPath.isFromValidated) {
            return {
              ...state,
              newPath: {
                ...state.newPath,
                to: { x: action.x, y: action.y, id: action.id },
                movedAfterFromCreation: true,
              },
            };
          } else {
            return {
              ...state,
              newPath: {
                ...state.newPath,
                from: { x: action.x, y: action.y, id: action.id },
              },
            };
          }
        case MODE_CREATE_NODE_ELEMENT:
          return {
            ...state,
            newNode: {
              ...state.newNode,
              position: { x: action.x, y: action.y, id: action.id },
            },
          };
        case MODE_RECTANGLE_SELECTION:
          const newRectangle = {
            ...state.rectangleSelection,
            x1: x,
            y1: y,
          };

          return {
            ...state,
            selection: [
              ...state.anchors.allIds.filter((id) =>
                isInRectangle(state.anchors.byId[id], newRectangle)
              ),
            ],
            rectangleSelection: {
              ...state.rectangleSelection,
              x1: x,
              y1: y,
            },
          };
        default:
          return state;
      }

    case START_CREATE_PATH_ELEMENT: {
      return {
        ...state,
        selection: [],
        adhesivePoints: [...getAdhesivePoints(action.elementType)],
        mode: MODE_CREATE_PATH_ELEMENT,
        newPath: {
          elementType: action.elementType,
          isFromValidated: false,
          from: { x: null, y: null, id: null },
          to: { x: null, y: null, id: null },
        },
      };
    }
    case START_CREATE_NODE_ELEMENT:
      return {
        ...state,
        selection: [],
        adhesivePoints: [...getAdhesivePoints(action.elementType)],
        mode: MODE_CREATE_NODE_ELEMENT,
        newNode: {
          elementType: action.elementType,
          position: { x: null, y: null, id: null },
        },
      };
    case ELEMENT_CREATION_NEXT_STEP:
      if (
        state.mode === MODE_CREATE_NODE_ELEMENT &&
        state.newNode.position.x !== null &&
        state.newNode.position.y !== null
      ) {
        const newId_element = uuid();
        const newId_anchor = uuid();

        let newAnchors = state.anchors;
        if (
          state.newNode.position.id === null ||
          !state.anchors.allIds.includes(state.newNode.position.id)
        ) {
          newAnchors = {
            byId: {
              ...state.anchors.byId,
              [newId_anchor]: {
                id: newId_anchor,
                x: state.newNode.position.x,
                y: state.newNode.position.y,
              },
            },
            allIds: [...state.anchors.allIds, newId_anchor],
          };
        }

        const positionId =
          state.newNode.position.id &&
          state.anchors.allIds.includes(state.newNode.position.id)
            ? state.newNode.position.id
            : newId_anchor;

        return {
          ...state,
          newNode: {
            ...state.newNode,
            position: { x: null, y: null, id: null },
          },
          pathComponents: {
            byId: {
              ...state.pathComponents.byId,
              [newId_element]: {
                id: newId_element,
                position: positionId,
                type: state.newNode.elementType,
              },
            },
            allIds: [...state.pathComponents.allIds, newId_element],
          },
          anchors: { ...newAnchors },
        };
      }
      return state;
    case VALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION:
      return {
        ...state,
        newPath: {
          ...state.newPath,
          to: { x: null, y: null, id: null },
          isFromValidated: true,
          movedAfterFromCreation: false,
        },
      };
    case INVALIDATE_FIRST_STEP_PATH_ELEMENT_CREATION:
      if (
        state.newPath.movedAfterFromCreation &&
        state.newPath.isFromValidated
      ) {
        return {
          ...state,
          newPath: {
            ...state.newPath,
            from: { ...state.newPath.to },
            to: { x: null, y: null, id: null },
            isFromValidated: false,
          },
        };
      } else {
        return state;
      }
    case SAVE_PATH_ELEMENT_CREATION:
      const newId_element = uuid();
      const newId_anchor_from = uuid();
      const newId_anchor_to = uuid();

      let newAnchors = { ...state.anchors };

      if (
        !isAnchor(state, state.newPath.from.id) &&
        isAnchor(state, state.newPath.to.id)
      ) {
        newAnchors = {
          byId: {
            ...state.anchors.byId,
            [newId_anchor_from]: {
              id: newId_anchor_from,
              x: state.newPath.from.x,
              y: state.newPath.from.y,
            },
          },
          allIds: [...state.anchors.allIds, newId_anchor_from],
        };
      } else if (
        !isAnchor(state, state.newPath.to.id) &&
        isAnchor(state, state.newPath.from.id)
      ) {
        newAnchors = {
          byId: {
            ...state.anchors.byId,
            [newId_anchor_to]: {
              id: newId_anchor_to,
              x: state.newPath.to.x,
              y: state.newPath.to.y,
            },
          },
          allIds: [...state.anchors.allIds, newId_anchor_to],
        };
      } else if (
        !isAnchor(state, state.newPath.from.id) &&
        !isAnchor(state, state.newPath.to.id)
      ) {
        newAnchors = {
          byId: {
            ...state.anchors.byId,
            [newId_anchor_from]: {
              id: newId_anchor_from,
              x: state.newPath.from.x,
              y: state.newPath.from.y,
            },
            [newId_anchor_to]: {
              id: newId_anchor_to,
              x: state.newPath.to.x,
              y: state.newPath.to.y,
            },
          },
          allIds: [...state.anchors.allIds, newId_anchor_from, newId_anchor_to],
        };
      }
      return {
        ...state,
        newPath: {
          ...state.newPath,
          isFromValidated: false,
          from: {
            ...state.newPath.to,
            id: isAnchor(state, state.newPath.to.id)
              ? state.newPath.to.id
              : newId_anchor_to,
          },
          to: {
            x: null,
            y: null,
            id: null,
          },
        },
        pathComponents: {
          byId: {
            ...state.pathComponents.byId,
            [newId_element]: {
              id: newId_element,
              from: isAnchor(state, state.newPath.from.id)
                ? state.newPath.from.id
                : newId_anchor_from,
              to: isAnchor(state, state.newPath.to.id)
                ? state.newPath.to.id
                : newId_anchor_to,
              type: state.newPath.elementType,
            },
          },
          allIds: [...state.pathComponents.allIds, newId_element],
        },
        anchors: { ...newAnchors },
      };
    case SPLIT_ANCHOR:
      let anchorId = action.anchorId;
      if (
        !anchorId &&
        state.selection.length === 1 &&
        state.anchors.allIds.includes(state.selection[0])
      ) {
        anchorId = state.selection[0];
      }
      if (anchorId && state.anchors.allIds.includes(anchorId)) {
        const componentsToChange = state.pathComponents.allIds.filter((id) =>
          componentUseThisAnchor(state.pathComponents.byId[id], anchorId)
        );
        if (componentsToChange.length <= 1) {
          return state;
        }

        const newAnchors = state.anchors;
        const newComponents = state.pathComponents.byId;

        componentsToChange.slice(1).forEach((componentId) => {
          const newAnchorId = uuid();

          newComponents[componentId] = replaceComponentAnchor(
            state.pathComponents.byId[componentId],
            anchorId,
            newAnchorId
          );

          newAnchors.allIds = [newAnchorId, ...newAnchors.allIds];
          newAnchors.byId = {
            ...newAnchors.byId,
            [newAnchorId]: { ...newAnchors.byId[anchorId] },
          };
        });

        return {
          ...state,
          pathComponents: {
            ...state.pathComponents,
            byId: { ...newComponents },
          },
          anchors: {
            allIds: [...newAnchors.allIds],
            byId: { ...newAnchors.byId },
          },
        };
      }
      return state;
    case START_RECTANGLE_SELECTION:
      return {
        ...state,
        mode: MODE_RECTANGLE_SELECTION,
        rectangleSelection: {
          x0: action.x,
          y0: action.y,
          x1: action.x,
          y1: action.y,
        },
      };
    case STOP_RECTANGLE_SELECTION:
      // add equality verification, if rectangle has no area it's probably a single click
      // so we reset the selection
      return {
        ...state,
        mode: MODE_SELECT,
        rectangleSelection: {},
        selection:
          state.rectangleSelection.x0 === state.rectangleSelection.x1 ||
          state.rectangleSelection.y0 === state.rectangleSelection.y1
            ? []
            : [...state.selection],
      };
    case STACK_SELECTED_ANCHORS:
      const anchorsSelected = state.selection.filter(
        (id) => id in state.anchors.byId
      );
      if (
        anchorsSelected.length <= 1 ||
        !["U", "D", "L", "R"].includes(action.direction)
      ) {
        return state;
      } else {
        const newPosition = {};

        anchorsSelected.forEach((id, index) => {
          const anchor = state.anchors.byId[id];

          switch (action.direction) {
            case "U":
              newPosition.y =
                index === 0 ? anchor.y : Math.min(newPosition.y, anchor.y);
              break;
            case "D":
              newPosition.y =
                index === 0 ? anchor.y : Math.max(newPosition.y, anchor.y);
              break;
            case "L":
              newPosition.x =
                index === 0 ? anchor.x : Math.min(newPosition.x, anchor.x);
              break;
            case "R":
              newPosition.x =
                index === 0 ? anchor.x : Math.max(newPosition.x, anchor.x);
              break;
            default:
              break;
          }
        });

        anchorsSelected.forEach((id) => {
          state.anchors.byId[id] = {
            ...state.anchors.byId[id],
            ...newPosition,
          };
        });
        return {
          ...state,
          anchors: {
            byId: { ...state.anchors.byId },
            allIds: state.anchors.allIds,
          },
        };
      }
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
