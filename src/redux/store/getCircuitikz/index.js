import { drawElement, isMultyPole, getElementAnchors } from "components";
import {
  isNode,
  isPath,
  findCommonAnchor,
  fillCoordWithAnchorsName,
  getPoles,
  simplifyNumber,
  getCoordId,
  getCoord,
  removeDrawnElements,
  compareCoord,
} from "./utils";
import drawPathFromCoord from "./drawPath";

// =============================================
// THIS IS A NIGHTMARE
// FIRST THING TO REFACTO
//  -> first idea : use auxiliary function with long names to be precise
//  -> put every information in nodeRef and Coords.
//          After there creation we should not need of the state anymore
// ==============================================

const initializeCoords = (state) => {
  // dict created :
  //
  // coords = {[(x, y)]: {
  //  x: number,
  //  y: number,
  //  name:null||str,
  //  startingPaths: [list of elements id],
  //  endingPaths: [list of elements id],
  //  nodeAssociated: [list of elements id],
  // }
  //
  // nodeReference = {
  //   [nodeId]: {
  //     name: null,
  //     parent: null,
  //     parentAnchor: null,
  //     anchor: null,
  //     associatedIds: [list of coordId relative to this node],
  //   }
  // }

  const coords = {};
  const nodeReference = {};

  // check coord of all to[] element
  state.components.allIds.forEach((id) => {
    const element = state.components.byId[id];
    if (isPath(element)) {
      const fromCoord = state.coordinates.byId[element.from];
      const toCoord = state.coordinates.byId[element.to];

      const fromCoordId = getCoordId(fromCoord);
      const toCoordId = getCoordId(toCoord);

      if (coords[fromCoordId] === undefined) {
        coords[fromCoordId] = {
          x: fromCoord.x.toFixed(2),
          y: fromCoord.y.toFixed(2),
          name: null,
          startingPaths: [element.id],
          endingPaths: [],
          nodeAssociated: [],
        };
      } else if (!coords[fromCoordId].startingPaths.includes(element.id)) {
        coords[fromCoordId].startingPaths.push(element.id);
      }

      if (coords[toCoordId] === undefined) {
        coords[toCoordId] = {
          x: toCoord.x.toFixed(2),
          y: toCoord.y.toFixed(2),
          name: null,
          endingPaths: [element.id],
          startingPaths: [],
          nodeAssociated: [],
        };
      } else if (!coords[toCoordId].endingPaths.includes(element.id)) {
        coords[toCoordId].endingPaths.push(element.id);
      }
    } else {
      nodeReference[element.id] = {
        name: null,
        parent: null,
        parentAnchor: null,
        anchor: null,
        associatedIds: [],
      };
      if (!isMultyPole[element.type]) {
        const positionCoord = state.coordinates.byId[element.position];
        const positionCoordId = getCoordId(positionCoord);

        if (coords[positionCoordId] === undefined) {
          coords[positionCoordId] = {
            x: positionCoord.x.toFixed(2),
            y: positionCoord.y.toFixed(2),
            name: null,
            startingPaths: [],
            endingPaths: [],
            nodeAssociated: [element.id],
          };
        } else if (
          !coords[positionCoordId].nodeAssociated.includes(element.id)
        ) {
          coords[positionCoordId].nodeAssociated.push(element.id);
        }
      }
    }
  });

  const weakLinks = [...state.weakLinks];

  // add node informations
  state.weakLinks.forEach(({ anchorId, nodeId }) => {
    const coord = state.coordinates.byId[anchorId];

    if (
      !coord.isNodePosition ||
      !isMultyPole[
        state.components.byId[state.coordinates.byId[anchorId].nodeId].type
      ]
    ) {
      const coordId = getCoordId(coord);
      if (!coords[coordId].nodeAssociated.includes(nodeId)) {
        coords[coordId].nodeAssociated.push(nodeId);
      }
      if (!nodeReference[nodeId].associatedIds.includes(coordId)) {
        nodeReference[nodeId].associatedIds.push(coordId);
      }
    }
  });

  const multipoleNodes = state.components.allIds.filter(
    (id) => isMultyPole[state.components.byId[id].type]
  );

  multipoleNodes.forEach((parentNodeId, index) => {
    const parent = { ...state.components.byId[parentNodeId] };
    parent.positionCoords = { ...state.coordinates.byId[parent.position] };

    // add multipole child (only those after in order to keep a directed tree structure)
    multipoleNodes.slice(index + 1).forEach((childNodeIdId) => {
      const child = { ...state.components.byId[childNodeIdId] };
      child.positionCoords = { ...state.coordinates.byId[child.position] };

      const { parentAnchor = null, childAnchor = null } = findCommonAnchor(
        parent,
        child
      );

      if (parentAnchor !== null && childAnchor !== null) {
        nodeReference[childNodeIdId].parent = parentNodeId;
        nodeReference[childNodeIdId].anchor = childAnchor;
        nodeReference[childNodeIdId].parentAnchor = parentAnchor;
        if (
          !nodeReference[parentNodeId].associatedIds.includes(childNodeIdId)
        ) {
          nodeReference[parentNodeId].associatedIds.push(childNodeIdId);
        }
      }
    });

    // add link between coordinates and node anchors
    Object.keys(coords).forEach((coordId) => {
      const anchors = getElementAnchors(parent);

      const { x: coordX, y: coordY } = coords[coordId];

      anchors.forEach(({ x: anchorX, y: anchorY }) => {
        if (
          Math.abs(coordX - anchorX) < 0.01 &&
          Math.abs(coordY - anchorY) < 0.01
        ) {
          if (!coords[coordId].nodeAssociated.includes(parent.id)) {
            coords[coordId].nodeAssociated.push(parent.id);
          }
          if (!nodeReference[parent.id].associatedIds.includes(coordId)) {
            nodeReference[parent.id].associatedIds.push(coordId);
          }
        }
      });
    });
  });

  return [coords, nodeReference];
};

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
