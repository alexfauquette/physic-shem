import {
  ZOOM,
  START_MOVE_PAPER,
  MOVE_PAPER,
  END_MOVE_PAPER,
  SET_MODE_MOVE_PAPER,
} from "../actions";
import { MODE_MOVE_PAPER } from "./interactionModes";

// If we want to use A4 format (not sure it's useful)
// const PAGE_WIDTH = 2100;
// const PAGE_HEIGHT = 2970;
const PAGE_WIDTH = 800;
const PAGE_HEIGHT = 500;

export const default_displayOptions = {
  x: 0,
  y: 0,
  zoom: 1,
  width: PAGE_WIDTH,
  height: PAGE_HEIGHT,
  dragging: {
    isDragging: false,
    x0: null,
    y0: null,
  },
};

const zoom = (state, action) => {
  const newZoom = action.zoom;
  const newWidth = PAGE_WIDTH / newZoom;
  const newHeight = PAGE_HEIGHT / newZoom;

  const { x, y, width, height } = state.displayOptions;

  // this do the center on the middle (no useful until SVG heigh is fixed to fit the screen size)
  const newX = x + width / 2 - newWidth / 2;
  const newY = y + height / 2 - newHeight / 2;

  return {
    ...state,
    displayOptions: {
      ...state.displayOptions,
      x: newX,
      y: newY,
      zoom: newZoom,
      width: newWidth,
      height: newHeight,
    },
  };
};

const toggleDragging = (state, action) => {
  const { x = null, y = null } = action;
  return {
    ...state,
    displayOptions: {
      ...state.displayOptions,
      dragging: {
        isDragging: !state.displayOptions.dragging.isDragging,
        x0: x,
        y0: y,
      },
    },
  };
};

const movePaper = (state, action) => {
  const { x, y } = action;
  const { x0, y0 } = state.displayOptions.dragging;
  return {
    ...state,
    displayOptions: {
      ...state.displayOptions,
      x: state.displayOptions.x + (x0 - x) / state.displayOptions.zoom,
      y: state.displayOptions.y + (y0 - y) / state.displayOptions.zoom,
      dragging: {
        ...state.displayOptions.dragging,
        x0: x,
        y0: y,
      },
    },
  };
};

const reducer_displayOptions = (state, action) => {
  switch (action.type) {
    case SET_MODE_MOVE_PAPER:
      return { ...state, mode: MODE_MOVE_PAPER };
    case ZOOM:
      return zoom(state, action);
    case MOVE_PAPER:
      return movePaper(state, action);
    case START_MOVE_PAPER:
    case END_MOVE_PAPER:
      return toggleDragging(state, action);
    default:
      return state;
  }
};
export default reducer_displayOptions;
