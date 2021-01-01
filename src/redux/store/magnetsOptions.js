import { UPDATE_MAGNET_OPTION } from "redux/actions";

export const default_magnetsOptions = {
  isGridAttracting: true,
  gridSpace: 1,
  isPathCoordinatesAttracting: true,
  isNodeAnchorsAttracting: true,
};

const reducer_magnetsOptions = (state, action) => {
  const { type, optionName, optionValue = null } = action;
  switch (type) {
    case UPDATE_MAGNET_OPTION:
      if (optionValue === null) {
        return {
          ...state,
          magnetsOptions: {
            ...state.magnetsOptions,
            [optionName]: !state.magnetsOptions[optionName],
          },
        };
      } else {
        return {
          ...state,
          magnetsOptions: {
            ...state.magnetsOptions,
            [optionName]: optionValue,
          },
        };
      }
    default:
      return state;
  }
};
export default reducer_magnetsOptions;
