import React from "react";
import components from "../components";
import { connect } from "react-redux";
import { MODE_SELECT, MODE_DRAG_ANCHOR } from "../redux/store";

const mapDispatchToProps = (dispatch) => {
  return {};
};
const mapStateToProps = (state) => {
  return state;
};

const Components = ({ pathComponents, selection, mode, startDrag }) => (
  <>
    {pathComponents.allIds
      .filter((id) => mode !== MODE_DRAG_ANCHOR || !selection.includes(id))
      .map(
        (id) =>
          pathComponents.byId[id].type &&
          components[pathComponents.byId[id].type]({
            ...pathComponents.byId[id],
            onMouseDown:
              mode === MODE_SELECT &&
              selection.includes(pathComponents.byId[id].id)
                ? (event) => {
                    event.stopPropagation();
                    if (!event.ctrlKey) {
                      startDrag(event);
                    }
                  }
                : null,
            onClick:
              mode === MODE_SELECT
                ? selection.includes(pathComponents.byId[id].id)
                  ? (event) => {
                      event.stopPropagation();
                      // if (event.ctrlKey) {
                      //   select(pathComponents.byId[id].id, event.ctrlKey);
                      // }
                    }
                  : (event) => {
                      event.stopPropagation();
                      // select(pathComponents.byId[id].id, event.ctrlKey);
                    }
                : null,
            selected: selection.includes(pathComponents.byId[id].id),
            // showHandles: mode === MODE_LINK,
          })
      )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Components);
