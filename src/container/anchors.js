import React from "react";
import { connect } from "react-redux";
import { startDragginAnchor } from "../redux/actions";
// import { MODE_DRAG } from "../redux/store";

const mapDispatchToProps = (dispatch) => {
  return {
    startDragging: (anchorId) => dispatch(startDragginAnchor(anchorId)),
  };
};
const mapStateToProps = (state) => {
  return { anchors: state.anchors };
};

const Anchors = ({ anchors, startDragging }) => (
  <>
    {anchors.allIds.map((id) => (
      <circle
        key={id}
        cx={anchors.byId[id].x}
        cy={anchors.byId[id].y}
        r={5}
        onMouseDown={() => startDragging(id)}
      />
    ))}
  </>
);

export default connect(mapStateToProps, mapDispatchToProps)(Anchors);
