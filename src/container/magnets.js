import React from "react";
import { connect } from "react-redux";

import {
  MODE_CREATE_PATH_ELEMENT,
  MODE_CREATE_NODE_ELEMENT,
  MODE_DRAG,
} from "redux/store/interactionModes";

import Magnet from "atoms/magnet";
import { getElementAnchors } from "components";

const mapStateToProps = (state) => {
  return {
    coordinates: state.coordinates,
    components: state.components,
    mode: state.mode,
    coordinatesToMove: state.coordinatesToMove,
    selection: state.selection,
    adhesivePoints: state.adhesivePoints || null,
    ...state.magnetsOptions,
  };
};

const isMoving = (element, coordinatesToMove) => {
  // help function to filter magnets
  if (!coordinatesToMove) {
    return false;
  }
  if (typeof element == "string" && coordinatesToMove.includes(element)) {
    return true;
  }
  if (element.from && coordinatesToMove.includes(element.from)) {
    return true;
  }
  if (element.to && coordinatesToMove.includes(element.to)) {
    return true;
  }
  if (element.position && coordinatesToMove.includes(element.position)) {
    return true;
  }
  return false;
};

const Magnets = ({
  mode,
  coordinates,
  components,
  coordinatesToMove,
  adhesivePoints,
  isPathCoordinatesAttracting,
  isNodeAnchorsAttracting,
}) => {
  // TODO : use a correct way to compute how many circle to draw
  if (
    mode !== MODE_DRAG &&
    mode !== MODE_CREATE_NODE_ELEMENT &&
    mode !== MODE_CREATE_PATH_ELEMENT
  ) {
    return null;
  }

  return (
    <>
      {isNodeAnchorsAttracting &&
        components.allIds
          .filter((id) => !isMoving(components.byId[id], coordinatesToMove))
          .reduce(
            (accumulator, id) => [
              ...accumulator,
              ...getElementAnchors({
                ...components.byId[id],
                fromCoords:
                  components.byId[id].from &&
                  coordinates.byId[components.byId[id].from],
                toCoords:
                  components.byId[id].to &&
                  coordinates.byId[components.byId[id].to],
                positionCoords:
                  components.byId[id].position &&
                  coordinates.byId[components.byId[id].position],
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
                          type: components.byId[id].position ? "NODE" : "PATH",
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
        coordinates.allIds
          .filter((id) => !isMoving(id, coordinatesToMove))
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
                    x={coordinates.byId[id].x}
                    dx={dx}
                    y={coordinates.byId[id].y}
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
