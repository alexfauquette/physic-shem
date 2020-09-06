export const ADD_ELEMENT = "ADD_ELEMENT";
export function addElement(x, y) {
  return {
    type: ADD_ELEMENT,
    x,
    y,
  };
}

export const START_ADDING_ELEMENT = "START_ADDING_ELEMENT";
export function startAddingElement(elementType) {
  return {
    type: START_ADDING_ELEMENT,
    elementType,
  };
}

export const NO_STATE = "NO_STATE";
export function resetState() {
  return {
    type: NO_STATE,
  };
}
