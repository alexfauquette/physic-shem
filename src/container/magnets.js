import React from "react";
import { connect } from "react-redux";

import {
  MODE_CREATE_ANCHOR,
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_DRAG,
} from "../redux/store";

import Magnet from "../atoms/magnet";
import { getElementAnchors } from "../components";

const mapStateToProps = (state) => {
  return {
    anchors: state.anchors,
    pathComponents: state.pathComponents,
    mode: state.mode,
  };
};

const Magnets = ({ mode, anchors, pathComponents }) => {
  if (
    mode !== MODE_DRAG &&
    mode !== MODE_CREATE_NODE_ELEMENT &&
    mode !== MODE_CREATE_PATH_ELEMENT &&
    mode !== MODE_CREATE_ANCHOR
  ) {
    return null;
  }

  return (
    <>
      {pathComponents.allIds.reduce(
        (accumulator, id) => [
          ...accumulator,
          ...getElementAnchors({
            ...pathComponents.byId[id],
            fromCoords:
              pathComponents.byId[id].from &&
              anchors.byId[pathComponents.byId[id].from],
            toCoords:
              pathComponents.byId[id].to &&
              anchors.byId[pathComponents.byId[id].to],
            positionCoords:
              pathComponents.byId[id].position &&
              anchors.byId[pathComponents.byId[id].position],
          }).map(({ x, y, name }) => (
            <Magnet key={`${id}-${name}`} x={x} y={y} />
          )),
        ],
        []
      )}
      {anchors.allIds.map((id) => (
        <Magnet key={id} {...anchors.byId[id]} color="pink" />
      ))}
    </>
  );
};

export default connect(mapStateToProps)(Magnets);
