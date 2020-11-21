import React from "react";
import components from "../components";
import { connect } from "react-redux";
import { MODE_SELECT } from "../redux/store";
import { toggleSelection, startDragging } from "../redux/actions";

const mapDispatchToProps = (dispatch, { svgRef }) => {
  return {
    toggleSelection: (objectId, reset) =>
      dispatch(toggleSelection(objectId, reset)),
    startDragging: (x, y) => {
      const { x: xOffset, y: yOffset } = svgRef.current.getBoundingClientRect();
      dispatch(startDragging(x - xOffset, y - yOffset));
    },
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
              ? (event) => {
                  event.stopPropagation();
                  if (
                    !event.ctrlKey &&
                    selection.includes(pathComponents.byId[id].id)
                  ) {
                    startDragging(
                      event.nativeEvent.clientX,
                      event.nativeEvent.clientY
                    );
                  } else {
                    toggleSelection(pathComponents.byId[id].id, !event.ctrlKey);
                  }
                }
              : null,
          selected: selection.includes(pathComponents.byId[id].id),
          // showHandles: mode === MODE_LINK,
        })
    )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Components);
