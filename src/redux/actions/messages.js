export const CLOSE_MESSAGE = "CLOSE_MESSAGE";
export function closeMessage(id) {
  return {
    type: CLOSE_MESSAGE,
    id,
  };
}

export const REMOVE_MESSAGE = "REMOVE_MESSAGE";
export function removeMessage(id) {
  return {
    type: REMOVE_MESSAGE,
    id,
  };
}

export const OPEN_MESSAGE = "OPEN_MESSAGE";
export function openMessage({ id, severity, text }) {
  return {
    type: OPEN_MESSAGE,
    id,
    severity,
    text,
  };
}

export const closeAndDeleteMessage = (id) => async (dispatch, getState) => {
  dispatch(closeMessage(id));

  setTimeout(() => {
    dispatch(removeMessage(id));
  }, 1000);
};
