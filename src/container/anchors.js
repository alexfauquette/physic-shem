import React from "react";
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
    anchors: state.anchors,
    mode: state.mode,
    selection: state.selection,
  };
};

const Anchors = ({
  anchors,
  mode,
  selection,
  startDragging,
  toggleSelection,
}) => (
  <>
    {anchors.allIds.map((id) => (
      <circle
        key={id}
        cx={anchors.byId[id].x}
        cy={anchors.byId[id].y}
        r={5}
        style={{
          fill: selection.includes(anchors.byId[id].id) ? "red" : null,
        }}
        onMouseDown={
          mode === MODE_SELECT
            ? selection.includes(anchors.byId[id].id)
              ? (event) => {
                  event.stopPropagation();
                  if (!event.ctrlKey) {
                    startDragging(
                      event.nativeEvent.offsetX,
                      event.nativeEvent.offsetY
                    );
                  } else {
                    toggleSelection(anchors.byId[id].id);
                  }
                }
              : (event) => {
                  event.stopPropagation();
                  toggleSelection(anchors.byId[id].id);
                }
            : null
        }
      />
    ))}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Anchors);
