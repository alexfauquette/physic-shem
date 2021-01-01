import React from "react";
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
      <Anchor
        key={id}
        id={id}
        svgRef={svgRef}
        displayOptions={displayOptions}
      />
    ))}
  </>
);

export default connect(mapStateToProps)(Anchors);
