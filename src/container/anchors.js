import React, { forwardRef } from "react";
import { connect } from "react-redux";

import Anchor from "atoms/anchor";

const mapStateToProps = (state) => {
  return {
    anchorIds: state.coordinates.allIds,
  };
};

const Anchors = ({ anchorIds, svgRef, displayOptions }) => (
  <>
    {anchorIds.map((id) => (
      <Anchor key={id} id={id} ref={svgRef} displayOptions={displayOptions} />
    ))}
  </>
);

const ConnectedAnchors = connect(mapStateToProps)(Anchors);

export default forwardRef((props, ref) => (
  <ConnectedAnchors {...props} svgRef={ref} />
));
