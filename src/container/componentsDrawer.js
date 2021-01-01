import React from "react";
import svgComponents from "components";
import { connect } from "react-redux";
import { MODE_SELECT } from "redux/store/interactionModes";
import { toggleSelection, startDragging } from "redux/actions";

const mapDispatchToProps = (dispatch, { svgRef, displayOptions }) => {
  return {
    toggleSelection: (objectId, reset) =>
      dispatch(toggleSelection(objectId, reset)),
    startDragging: (x, y) => {
      const {
        x: xOffset,
        y: yOffset,
        width: svgWidth,
        height: svgHeight,
      } = svgRef.current.getBoundingClientRect();

      const {
        x: SVG_X,
        y: SVG_Y,
        width: SVG_WIDTH,
        height: SVG_HEIGHT,
        zoom,
      } = displayOptions;

      dispatch(
        startDragging(
          SVG_X + (x - xOffset) * (SVG_WIDTH / svgWidth),
          SVG_Y + (y - yOffset) * (SVG_HEIGHT / svgHeight)
        )
      );
    },
  };
};
const mapStateToProps = (state) => {
  return {
    components: state.components,
    selection: state.selection,
    mode: state.mode,
  };
};

const ComponentsDrawer = ({
  components,
  selection,
  mode,
  startDragging,
  toggleSelection,
}) => (
  <>
    {components.allIds.map(
      (id) =>
        components.byId[id].type &&
        svgComponents[components.byId[id].type]({
          ...components.byId[id],
          onMouseDown:
            mode === MODE_SELECT
              ? (event) => {
                  event.stopPropagation();
                  if (
                    !event.ctrlKey &&
                    selection.includes(components.byId[id].id)
                  ) {
                    startDragging(
                      event.nativeEvent.clientX,
                      event.nativeEvent.clientY
                    );
                  } else {
                    toggleSelection(components.byId[id].id, !event.ctrlKey);
                  }
                }
              : null,
          selected: selection.includes(components.byId[id].id),
        })
    )}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(ComponentsDrawer);
