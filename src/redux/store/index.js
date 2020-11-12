import { createStore } from "redux";
import {
  START_DRAGGING,
  START_SELECT,
  TOGGLE_SELECTION,
  STOP_DRAGGING,
  START_CREATE_ANCHOR,
  SAVE_ANCHOR_CREATION,
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
} from "../actions";

import { getElementAnchors, isPath } from "../../components";

import { v4 as uuid } from "uuid";

export const MODE_SELECT = "MODE_SELECT";
export const MODE_DRAG = "MODE_DRAG";
export const MODE_DELETE = "MODE_DELETE";
export const MODE_SPLIT_ANCHOR = "MODE_SPLIT_ANCHOR";
export const MODE_CREATE_ANCHOR = "MODE_CREATE_ANCHOR";
export const MODE_CREATE_PATH_ELEMENT = "MODE_CREATE_PATH_ELEMENT";
export const MODE_CREATE_NODE_ELEMENT = "MODE_CREATE_NODE_ELEMENT";
export const MODE_RECTANGLE_SELECTION = "MODE_RECTANGLE_SELECTION";

const getAdhesivePoints = (elementType) => {
  const adhesivePoints = [];
  if (isPath[elementType]) {
    adhesivePoints.push({
      type: "ANCHOR",
      id: null,
      dx: 0,
      dy: 0,
    });
  } else {
    adhesivePoints.push({
      type: "ANCHOR",
      id: null,
      dx: 0,
      dy: 0,
    });
    const anchors = getElementAnchors({
      type: elementType,
      fromCoords: { x: 0, y: 0 },
      toCoords: { x: 0, y: 0 },
      positionCoords: { x: 0, y: 0 },
    });
    anchors.forEach(({ x, y, name }) => {
      adhesivePoints.push({
        type: "COMPONENT", // TODO use constant file
        name: name,
        id: null,
        dx: -x,
        dy: -y,
      });
    });
  }
  return adhesivePoints;
};

const componentUseThisAnchor = (element, anchorId) => {
  if (element.from && element.from === anchorId) {
    return true;
  }
  if (element.to && element.to === anchorId) {
    return true;
  }
  if (element.position && element.position === anchorId) {
    return true;
  }
  return false;
};

const replaceComponentAnchor = (element, previousAnchorId, newAnchorId) => {
  const newElement = { ...element };
  if (element.from && element.from === previousAnchorId) {
    newElement.from = newAnchorId;
  }
  if (element.to && element.to === previousAnchorId) {
    newElement.to = newAnchorId;
  }
  if (element.position && element.position === previousAnchorId) {
    newElement.position = newAnchorId;
  }
  return { ...newElement };
};

const isInRectangle = ({ x, y }, { x0, y0, x1, y1 }) => {
  return (
    Math.abs(x - x0) + Math.abs(x - x1) <= Math.abs(x1 - x0) &&
    Math.abs(y - y0) + Math.abs(y - y1) <= Math.abs(y1 - y0)
  );
};

const initial_state = {
  mode: MODE_SELECT,
  selection: [],
  links: [],
  adhesivePoints: [],
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
        type: "pR",
      },
      id2: {
        id: "id2",
        from: "anchor2",
        to: "anchor3",
        type: "empty led",
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
        position: "anchor6",
        type: "nmos",
        angle: -45,
        positionAnchor: "B",
      },
      id6: {
        id: "id6",
        position: "anchor7",
        type: "nmos",
        angle: "",
        positionAnchor: "",
      },
    },
    allIds: ["id1", "id2", "id3", "id4", "id5", "id6"],
  },
  anchors: {
    byId: {
      anchor1: {
        id: "anchor1",
        x: 10,
        y: 100,
      },
      anchor2: {
        id: "anchor2",
        x: 500,
        y: 100,
      },
      anchor3: {
        id: "anchor3",
        x: 250,
        y: 100,
      },
      anchor4: {
        id: "anchor4",
        x: 250,
        y: 200,
      },
      anchor5: {
        id: "anchor5",
        x: 250,
        y: 10,
      },
      anchor6: {
        id: "anchor6",
        x: 100,
        y: 200,
      },
      anchor7: {
        id: "anchor7",
        x: 100,
        y: 200,
      },
    },
    allIds: [
      "anchor1",
      "anchor2",
      "anchor3",
      "anchor4",
      "anchor5",
      "anchor6",
      "anchor7",
    ],
  },
};

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
      const anchorsToMove = [];
      const adhesivePoints = [];

      state.selection.forEach((selectedId) => {
        if (state.anchors.allIds.includes(selectedId)) {
          if (
            adhesivePoints.findIndex((elem) => elem.id === selectedId) === -1
          ) {
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
              state.anchors.byId[
                state.pathComponents.byId[selectedId].position
              ],
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
              (elem) =>
                elem.id === state.pathComponents.byId[selectedId].position
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
            !anchorsToMove.includes(
              state.pathComponents.byId[selectedId].position
            )
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
    case STOP_DRAGGING:
      if (
        action.attractor &&
        action.attracted &&
        action.attracted.type === "ANCHOR" &&
        action.attractor.type === "ANCHOR"
      ) {
        // we need to fusion those anchors
        const anchorToRemoveID = action.attracted.id;
        const anchorToUseId = action.attractor.id;

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
        state.pathComponents.allIds.forEach((id) => {
          newByIDElements[id] = replaceComponentAnchor(
            state.pathComponents.byId[id],
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
          pathComponents: {
            ...state.pathComponents,
            byId: { ...newByIDElements },
          },
          mode: MODE_SELECT,
          anchorsToMove: [],
          originalPosition: {},
          alreadyMoved: {},
        };
      }

      return {
        ...state,
        mode: MODE_SELECT,
        anchorsToMove: [],
        originalPosition: {},
        alreadyMoved: {},
      };

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
        case MODE_CREATE_ANCHOR:
          return {
            ...state,
            newAnchor: {
              x: x,
              y: y,
              id: id,
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
    case START_CREATE_ANCHOR:
      return {
        ...state,
        selection: [],
        adhesivePoints: [{ type: "ANCHOR", id: null, dx: 0, dy: 0 }],
        mode: MODE_CREATE_ANCHOR,
        newAnchor: {
          x: null,
          y: null,
          id: null,
        },
      };

    case SAVE_ANCHOR_CREATION:
      if (state.newAnchor.id === null) {
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
        if (state.newNode.position.id === null) {
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
                position: state.newNode.position.id || newId_anchor,
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

      if (state.newPath.from.id === null && !!state.newPath.to.id) {
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
      } else if (state.newPath.to.id === null && !!state.newPath.from.id) {
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
        state.newPath.to.id === null &&
        state.newPath.from.id === null
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
          from: { ...state.newPath.to },
          to: { x: null, y: null, id: null },
        },
        pathComponents: {
          byId: {
            ...state.pathComponents.byId,
            [newId_element]: {
              id: newId_element,
              from: state.newPath.from.id || newId_anchor_from,
              to: state.newPath.to.id || newId_anchor_to,
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
      console.log(anchorsSelected);
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
    default:
      return state;
  }
}

// Create a Redux store holding the state of your app.
// Its API is { subscribe, dispatch, getState }.
let store = createStore(update);

export default store;
