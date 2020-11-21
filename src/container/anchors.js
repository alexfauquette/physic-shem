import React from "react";
import { connect } from "react-redux";

import Anchor from "../atoms/anchor";

const mapStateToProps = (state) => {
  return {
    anchorIds: state.anchors.allIds,
  };
};

const Anchors = ({ anchorIds, svgRef }) => (
  <>
    {anchorIds.map((id) => (
      <Anchor key={id} id={id} svgRef={svgRef} />
    ))}
  </>
);

export default connect(mapStateToProps)(Anchors);
