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
    {Object.keys(scene)
      .filter((id) => mode !== MODE_DRAG || !selection.includes(id))
      .map(
        (id) =>
          scene[id].type &&
          components[scene[id].type]({
            id,
            onMouseDown:
              mode === MODE_SELECT && selection.includes(id)
                ? (event) => {
                    event.stopPropagation();
                    if (!event.ctrlKey) {
                      startDrag(event);
                    }
                  }
                : null,
            onClick:
              mode === MODE_SELECT
                ? selection.includes(id)
                  ? (event) => {
                      event.stopPropagation();
                      if (event.ctrlKey) {
                        select(id, event.ctrlKey);
                      }
                    }
                  : (event) => {
                      event.stopPropagation();
                      select(id, event.ctrlKey);
                    }
                : null,
            selected: selection.includes(id),
            showHandles: mode === MODE_LINK,
          })
      )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Components);
