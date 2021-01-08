import { drawElement, isMultyPole } from "components";
import { isNode, fillCoordWithAnchorsName, compareCoord } from "./utils";
import drawPathFromCoord from "./drawPath";
import initializeCoords from "./initializeCoords";

// =============================================
// THIS IS A NIGHTMARE
// FIRST THING TO REFACTO
//  -> first idea : use auxiliary function with long names to be precise
//  -> put every information in nodeRef and Coords.
//          After there creation we should not need of the state anymore
// ==============================================

function getCircuitikz(state) {
  const [coords, nodeReference] = initializeCoords(state);

  const drawnElements = {}; //[id]:true when element of this id is drawn
  let nbOfCoordinateUsed = 0; // counter to save coordinate with name : point1, point2, ...
  const nodeNumberOfNames = {}; // conter for naming multi-pole (in order to start from 1 for each type of node) exemple: nmos1, pmos1, nmos2
  const circuitText = ["\\begin{circuitikz}"];

  // ========================
  // 1. Draw multi-pole nodes
  // ========================
  const multiAnchorNodeIds = state.components.allIds
    .filter((elementId) => {
      // filter nodes to get only multi-pole
      const element = state.components.byId[elementId];
      return isNode(element) && isMultyPole[element.type];
    })
    .sort((id1, id2) => {
      // sort them according to there dependencies
      if (nodeReference[id1].parent === null) {
        return -1; //if they are both null (without parent) id1 is preferred (so we do not need to check id2)
      }
      if (nodeReference[id2].parent === null) {
        return 1; //if we are here, it's that id1 is not null. but id2 is so we prefer it
      }
      if (nodeReference[id2].parent === id1) {
        //id1 is parent of id2
        return -1; //so 1 must be printed before 2
      }
      if (nodeReference[id1].parent === id2) {
        //id2 is parent of id1
        return -1; //so 2 must be printed before 1
      }
      return -1;
    });

  multiAnchorNodeIds.forEach((elementId) => {
    const element = state.components.byId[elementId];

    // get parent information for positioning
    const positionInformations = {};
    if (nodeReference[elementId].parent !== null) {
      positionInformations.position = `${
        nodeReference[nodeReference[elementId].parent].name
      }.${nodeReference[elementId].parentAnchor}`;

      positionInformations.anchor = nodeReference[elementId].anchor;
    } else {
      positionInformations.x = state.coordinates.byId[element.position].x;
      positionInformations.y = state.coordinates.byId[element.position].y;
    }

    // check if need to create name
    const nameNeeded = nodeReference[elementId].associatedIds.length > 0;
    if (nameNeeded) {
      const name = `${element.type}${nodeNumberOfNames[element.type] || 1}`;

      circuitText.push(drawElement(element, positionInformations, name));

      nodeReference[element.id].name = name;
      nodeNumberOfNames[element.type] =
        (nodeNumberOfNames[element.type] || 1) + 1;
    } else {
      circuitText.push(drawElement(element, positionInformations));
    }

    drawnElements[elementId] = true; //note that this node is ok
  });

  // =====================================================
  // 2. Associate anchor name to coordinates when possible
  // =====================================================
  // TODO : an good idea could be not to trust weak links but to compare anchor coordinate with used coordinates

  const multipoleNodes = state.components.allIds
    .filter((id) => isMultyPole[state.components.byId[id].type])
    .map((id) => {
      const node = { ...state.components.byId[id] };
      node.positionCoords = { ...state.coordinates.byId[node.position] };
      return node;
    });

  fillCoordWithAnchorsName(multipoleNodes, coords, nodeReference, state);

  // ====================================
  // 3. Draw path from multi-pole coordinates
  // ====================================
  multiAnchorNodeIds.forEach((nodeId) => {
    nodeReference[nodeId].associatedIds.forEach((childId) => {
      if (coords[childId] !== undefined) {
        const [elementsToAdd, nbOfCreatedNames] = drawPathFromCoord(
          childId,
          coords,
          state,
          drawnElements,
          nbOfCoordinateUsed
        );

        if (elementsToAdd.length > 0) {
          nbOfCoordinateUsed += nbOfCreatedNames;
          circuitText.push(elementsToAdd.join(""));
        }
      }
    });
  });

  // ===========================
  // 4. Draw all remaining paths
  // ===========================
  const coordsToPlot = Object.keys(coords);
  while (coordsToPlot.length > 0) {
    // get coordinate id to start the path according to "compareCoord" function
    const idToPlot = coordsToPlot.sort(compareCoord(drawElement, coords))[0];

    //plot it
    if (coords[idToPlot] !== undefined) {
      const [elementsToAdd, nbOfCreatedNames] = drawPathFromCoord(
        idToPlot,
        coords,
        state,
        drawnElements,
        nbOfCoordinateUsed
      );

      if (elementsToAdd.length > 0) {
        nbOfCoordinateUsed += nbOfCreatedNames;
        circuitText.push(elementsToAdd.join(""));
      } else {
        // remove it from the list because there is no more things to draw from here
        const index = coordsToPlot.indexOf(idToPlot);
        coordsToPlot.splice(index, 1);
      }
    } else {
      // remove it from the list because this coordinate does not exist
      const index = coordsToPlot.indexOf(idToPlot);
      coordsToPlot.splice(index, 1);
    }
  }
  circuitText.push("\\end{circuitikz}");

  return circuitText;
}

export default getCircuitikz;
