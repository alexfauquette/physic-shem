import React from "react";
import { connect } from "react-redux";

import {
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_DRAG,
} from "../redux/store/interactionModes";

import Magnet from "../atoms/magnet";
import { getElementAnchors } from "../components";
import { MULTIPLICATIVE_CONST } from "../components/constantes";

const mapStateToProps = (state) => {
  return {
    anchors: state.anchors,
    pathComponents: state.pathComponents,
    mode: state.mode,
    anchorsToMove: state.anchorsToMove,
    selection: state.selection,
    adhesivePoints: state.adhesivePoints || null,
    ...state.magnetsOptions,
  };
};

const isMoving = (element, anchorsToMove) => {
  // help function to filter magnets
  if (!anchorsToMove) {
    return false;
  }
  if (typeof element == "string" && anchorsToMove.includes(element)) {
    return true;
  }
  if (element.from && anchorsToMove.includes(element.from)) {
    return true;
  }
  if (element.to && anchorsToMove.includes(element.to)) {
    return true;
  }
  if (element.position && anchorsToMove.includes(element.position)) {
    return true;
  }
  return false;
};

const Magnets = ({
  mode,
  anchors,
  pathComponents,
  anchorsToMove,
  adhesivePoints,
  isGridAttracting,
  gridSpace,
  isPathCoordinatesAttracting,
  isNodeAnchorsAttracting,
}) => {
  // TODO : use a correct way to compute how many circle to draw
  if (
    mode !== MODE_DRAG &&
    mode !== MODE_CREATE_NODE_ELEMENT &&
    mode !== MODE_CREATE_PATH_ELEMENT
  ) {
    return isGridAttracting ? (
      <>
        {[0, 1, 2, 3, 4, 5].flatMap((x) =>
          [1, 2, 3, 4, 5].map((y) => {
            return (
              <circle
                key={`${x}-${y}`}
                cx={x * gridSpace * MULTIPLICATIVE_CONST}
                cy={y * gridSpace * MULTIPLICATIVE_CONST}
                r={2}
                color="gray"
              />
            );
          })
        )}
      </>
    ) : null;
  }

  return (
    <>
      {isGridAttracting &&
        [0, 1, 2, 3, 4, 5].flatMap((x) =>
          [1, 2, 3, 4, 5].map((y) => {
            return (
              <>
                <circle
                  key={`${x}-${y}`}
                  cx={x * gridSpace * MULTIPLICATIVE_CONST}
                  cy={y * gridSpace * MULTIPLICATIVE_CONST}
                  r={2}
                  color="gray"
                />
                <Magnet
                  key={`${x}-${y}`}
                  x={x * gridSpace * MULTIPLICATIVE_CONST}
                  dx={0}
                  y={y * gridSpace * MULTIPLICATIVE_CONST}
                  dy={0}
                  mode={mode}
                  attractor={null}
                  // TODO : fill correctly attracted and adapt reducer
                  // think about not using this part of code but directly implement it in the update position reducer
                  attracted={null}
                />
              </>
            );
          })
        )}
      {isNodeAnchorsAttracting &&
        pathComponents.allIds
          .filter((id) => !isMoving(pathComponents.byId[id], anchorsToMove))
          .reduce(
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
                        key={`${id}-${name}<-${idAdhesive}-${
                          nameAdhesive || ""
                        }`}
                        x={x}
                        dx={dx}
                        y={y}
                        dy={dy}
                        mode={mode}
                        attractor={{
                          type: pathComponents.byId[id].position
                            ? "NODE"
                            : "PATH",
                          name: name,
                          id: id,
                        }}
                        attracted={{
                          type: type,
                          name: nameAdhesive,
                          id: idAdhesive,
                        }}
                      />,
                    ];
                  },
                  []
                )
              ),
            ],
            []
          )}
      {isPathCoordinatesAttracting &&
        anchors.allIds
          .filter((id) => !isMoving(id, anchorsToMove))
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
                    x={anchors.byId[id].x}
                    dx={dx}
                    y={anchors.byId[id].y}
                    dy={dy}
                    mode={mode}
                    attractor={{ type: "ANCHOR", name: "", id: id }}
                    attracted={{
                      type: type,
                      name: nameAdhesive,
                      id: idAdhesive,
                    }}
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
