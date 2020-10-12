import React from "react";
import components from "../components";
import { connect } from "react-redux";
import { MODE_SELECT } from "../redux/store";
import { toggleSelection, startDragging } from "../redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    toggleSelection: (objectId) => dispatch(toggleSelection(objectId)),
    startDragging: (x, y) => dispatch(startDragging(x, y)),
  };
};
const mapStateToProps = (state) => {
  return {
    pathComponents: state.pathComponents,
    selection: state.selection,
    mode: state.mode,
  };
};

const Components = ({
  pathComponents,
  selection,
  mode,
  startDragging,
  toggleSelection,
}) => (
  <>
    {pathComponents.allIds.map(
      (id) =>
        pathComponents.byId[id].type &&
        components[pathComponents.byId[id].type]({
          ...pathComponents.byId[id],
          onMouseDown:
            mode === MODE_SELECT
              ? selection.includes(pathComponents.byId[id].id)
                ? (event) => {
                    event.stopPropagation();
                    if (!event.ctrlKey) {
                      startDragging(
                        event.nativeEvent.offsetX,
                        event.nativeEvent.offsetY
                      );
                    } else {
                      toggleSelection(pathComponents.byId[id].id);
                    }
                  }
                : (event) => {
                    event.stopPropagation();
                    toggleSelection(pathComponents.byId[id].id);
                  }
              : null,
          selected: selection.includes(pathComponents.byId[id].id),
          // showHandles: mode === MODE_LINK,
        })
    )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Components);
