import React from "react";
import components from "../components";
import { connect } from "react-redux";
import { selectElement } from "../redux/actions";
import { MODE_SELECT, MODE_DRAG, MODE_LINK } from "../redux/store";

const mapDispatchToProps = (dispatch) => {
  return {
    select: (objectId, ctrlPressed) =>
      dispatch(selectElement(objectId, ctrlPressed)),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Components = ({ scene, selection, mode, startDrag, select }) => (
  <>
    {scene
      .filter(
        (element) => mode !== MODE_DRAG || !selection.includes(element.id)
      )
      .map(
        (element) =>
          element.type &&
          components[element.type]({
            ...element,
            onMouseDown:
              mode === MODE_SELECT && selection.includes(element.id)
                ? (event) => {
                    event.stopPropagation();
                    if (!event.ctrlKey) {
                      startDrag(event);
                    }
                  }
                : null,
            onClick:
              mode === MODE_SELECT
                ? selection.includes(element.id)
                  ? (event) => {
                      event.stopPropagation();
                      if (event.ctrlKey) {
                        select(element.id, event.ctrlKey);
                      }
                    }
                  : (event) => {
                      event.stopPropagation();
                      select(element.id, event.ctrlKey);
                    }
                : null,
            selected: selection.includes(element.id),
            showHandles: mode === MODE_LINK,
          })
      )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Components);
