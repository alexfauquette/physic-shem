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
    anchorsToMove: state.anchorsToMove,
    selection: state.selection,
    adhesivePoints: state.adhesivePoints || null,
  };
};

const Magnets = ({
  mode,
  anchors,
  pathComponents,
  anchorsToMove,
  adhesivePoints,
}) => {
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
          }).map(({ x, y, name }) =>
            adhesivePoints.reduce(
              (
                accu,
                { type, dx, dy, name: nameAdhesive = "", id: idAdhesive }
              ) => {
                return [
                  ...accu,
                  <Magnet
                    key={`${id}-${name}<-${idAdhesive}-${nameAdhesive || ""}`}
                    x={x + dx}
                    y={y + dy}
                  />,
                ];
              },
              []
            )
          ),
        ],
        []
      )}
      {anchors.allIds
        .filter((id) => !anchorsToMove.includes(id))
        .map((id) =>
          adhesivePoints.reduce(
            (
              accu,
              { type, dx, dy, name: nameAdhesive = "", id: idAdhesive }
            ) => {
              return [
                ...accu,
                <Magnet
                  key={`${id}<-${idAdhesive}-${nameAdhesive || ""}`}
                  x={anchors.byId[id].x + dx}
                  y={anchors.byId[id].y + dy}
                />,
              ];
            },
            []
          )
        )}
    </>
  );
};

export default connect(mapStateToProps)(Magnets);
