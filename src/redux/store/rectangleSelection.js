import { point_included, rect_included } from "utils";

import { MODE_SELECT, MODE_RECTANGLE_SELECTION } from "./interactionModes";
import { getBoundingBox } from "components";

export const updatePosition = (state, action) => {
  const { x, y } = action;
  const newRectangle = {
    ...state.rectangleSelection,
    x1: x,
    y1: y,
  };

  return {
    ...state,
    selection: [
      ...state.coordinates.allIds.filter((id) =>
        point_included(newRectangle, state.coordinates.byId[id])
      ),
      ...state.components.allIds.filter((id) =>
        rect_included(
          newRectangle,
          getBoundingBox(state.components.byId[id], state.coordinates.byId)
        )
      ),
    ],
    rectangleSelection: {
      ...state.rectangleSelection,
      x1: x,
      y1: y,
    },
  };
};

export const stopRectangleSelection = (state, action) => {
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
};

export const startRectangleSelection = (state, action) => {
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
};
