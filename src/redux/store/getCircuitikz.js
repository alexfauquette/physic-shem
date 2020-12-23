import { drawElement, isMultyPole, isPath } from "../../components";
import { MULTIPLICATIVE_CONST, R_LEN } from "../../components/constantes";

const isNode = (element) => !!element.position;

const getCoordId = ({ x, y }) =>
  `${typeof x === "number" ? x.toFixed(2) : x}-${
    typeof y === "number" ? y.toFixed(2) : y
  }`;

// helper to write latex coordinate
const getCoord = (x, y, coords) => {
  const coordId = getCoordId({ x: x, y: y });

  if (coords[coordId].name) {
    return `(${coords[coordId].name})`;
  } else {
    return `(${((x / MULTIPLICATIVE_CONST) * R_LEN).toFixed(2)}, ${(
      (-y / MULTIPLICATIVE_CONST) *
      R_LEN
    ).toFixed(2)})`;
  }
};

const removeDrawnElements = (drawnElements) => (listeOfId) =>
  listeOfId.filter((id) => !drawnElements[id]);

// comparing function to decide which coordinate should be drawn first
const compareCoord = (drawnElements, coords) => (coordId1, coordId2) => {
  const { endingPaths: endingPaths1, nodeAssociated: nodeAssociated1 } = coords[
    coordId1
  ];
  const { endingPaths: endingPaths2, nodeAssociated: nodeAssociated2 } = coords[
    coordId2
  ];

  // we prefer starting from a coordinate with no arriving path element or as less a possible
  if (
    removeDrawnElements(drawnElements)(endingPaths1).length <
    removeDrawnElements(drawnElements)(endingPaths2).length
  ) {
    return -1;
  }
  if (
    removeDrawnElements(drawnElements)(endingPaths1).length >
    removeDrawnElements(drawnElements)(endingPaths2).length
  ) {
    return 1;
  }

  // for equivalent number of arriving path, we prefer the one with the most important number of nodes
  if (
    removeDrawnElements(drawnElements)(nodeAssociated1).length >
    removeDrawnElements(drawnElements)(nodeAssociated2).length
  ) {
    return -1;
  }
  if (
    removeDrawnElements(drawnElements)(nodeAssociated1).length <
    removeDrawnElements(drawnElements)(nodeAssociated2).length
  ) {
    return 1;
  }
  return 0;
};

// this function start from the coordinate "startCoordId" and follow a path by drawing components
const drawPathFromCoord = (
  startCoordId,
  coords,
  state,
  drawnElements,
  nbOfCoordinateUsed
) => {
  const elementsToAdd = []; // list of the elements in the line to write

  // variables to save some coordinates
  let nbOfCreatedNames = 0;
  let nextName = `point${nbOfCoordinateUsed + 1}`;

  // create variable updatable
  let currantCoordId = startCoordId;
  let currantCoord = coords[currantCoordId];

  // informations on the currant node
  let nextPaths = currantCoord.startingPaths.filter((id) => !drawnElements[id]); //remove drawn elements
  let arrivingPaths = currantCoord.endingPaths.filter(
    (id) => !drawnElements[id]
  );
  let nextNode = currantCoord.nodeAssociated.filter((id) => !drawnElements[id]); // remove drawn elements (multi-pole are already drawn at this step)

  // get ready to loop on components to add
  let coordIsNew = true;
  while (nextPaths.length > 0 || nextNode.length > 0) {
    // add draw if it's the beginning
    if (elementsToAdd.length === 0) {
      elementsToAdd.push(`\\draw `);
    }

    // add the coordinate if needed
    if (coordIsNew) {
      elementsToAdd.push(
        `${getCoord(currantCoord.x, currantCoord.y, coords)} `
      );
      if (
        !currantCoord.name &&
        (nextPaths.length > 1 || arrivingPaths.length > 0)
      ) {
        //save name if we will need to start from here again or to arrive to here in the future
        elementsToAdd.push(`coordinate(${nextName}) `);
        coords[currantCoordId].name = nextName;

        //get ready for next name
        nbOfCreatedNames += 1;
        nextName = `point${nbOfCoordinateUsed + nbOfCreatedNames + 1}`;
      }
    }

    if (nextNode.length > 0) {
      // create a node if possible
      coordIsNew = false;
      const nodeId = nextNode.pop();
      const element = state.pathComponents.byId[nodeId];

      elementsToAdd.push(`${drawElement(element)} `);
      drawnElements[element.id] = true;
    } else {
      // create path if no more node is to draw
      coordIsNew = true;
      const element = state.pathComponents.byId[nextPaths[0]];

      elementsToAdd.push(drawElement(element));
      drawnElements[element.id] = true;

      // get information of the next coordinate
      currantCoordId = getCoordId(state.anchors.byId[element.to]);
      currantCoord = coords[currantCoordId];
      nextPaths = currantCoord.startingPaths.filter((id) => !drawnElements[id]); //only path elements starting here not already drawn
      arrivingPaths = currantCoord.endingPaths.filter(
        (id) => !drawnElements[id]
      );
      nextNode = currantCoord.nodeAssociated.filter((id) => !drawnElements[id]);
    }
  }
  // There is no elements to draw from the currant coordinate

  if (elementsToAdd.length > 0) {
    if (coordIsNew) {
      // if it's a new coordinate, we add it to the list
      elementsToAdd.push(
        `${getCoord(currantCoord.x, currantCoord.y, coords)} `
      );
      if (!currantCoord.name && arrivingPaths.length > 0) {
        // we give it a name if needed
        coords[currantCoordId].name = nextName;
        elementsToAdd.push(`coordinate(${nextName}) `);
        nbOfCreatedNames += 1;
        nextName = `point${nbOfCoordinateUsed + nbOfCreatedNames + 1}`;
      }
    }

    elementsToAdd.push(";"); //add the semi colon at the end of the line
  }

  // return the elements of the line and an indicator to update the number of coordinate saved
  return [elementsToAdd, nbOfCreatedNames];
};

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
  state.pathComponents.allIds.forEach((id) => {
    const element = state.pathComponents.byId[id];
    if (isPath[element.type]) {
      const fromCoord = state.anchors.byId[element.from];
      const toCoord = state.anchors.byId[element.to];

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
        const positionCoord = state.anchors.byId[element.position];
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

  // add node informations
  state.weakLinks.forEach(({ anchorId, nodeId, name, nameAnchor }) => {
    const coord = state.anchors.byId[anchorId];

    if (
      !coord.isNodePosition ||
      !isMultyPole[
        state.pathComponents.byId[state.anchors.byId[anchorId].nodeId].type
      ]
    ) {
      const coordId = getCoordId(coord);
      if (!coords[coordId].nodeAssociated.includes(nodeId)) {
        coords[coordId].nodeAssociated.push(nodeId);
      }
      if (!nodeReference[nodeId].associatedIds.includes(coordId)) {
        nodeReference[nodeId].associatedIds.push(coordId);
      }
    } else {
      const childId = state.anchors.byId[anchorId].nodeId;
      nodeReference[childId].parent = nodeId;
      nodeReference[childId].anchor = nameAnchor;
      nodeReference[childId].parentAnchor = name;
      if (!nodeReference[nodeId].associatedIds.includes(childId)) {
        nodeReference[nodeId].associatedIds.push(childId);
      }
    }
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
  const multiAnchorNodeIds = state.pathComponents.allIds
    .filter((elementId) => {
      // filter nodes to get only multi-pole
      const element = state.pathComponents.byId[elementId];
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
    const element = state.pathComponents.byId[elementId];

    // get parent information for positioning
    const positionInformations = {};
    if (nodeReference[elementId].parent !== null) {
      positionInformations.position = `${
        nodeReference[nodeReference[elementId].parent].name
      }.${nodeReference[elementId].parentAnchor}`;

      positionInformations.anchor = nodeReference[elementId].anchor;
    } else {
      positionInformations.x = state.anchors.byId[element.position].x;
      positionInformations.y = state.anchors.byId[element.position].y;
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
  state.weakLinks.forEach(({ anchorId, nodeId, name, nameAnchor }) => {
    const coord = state.anchors.byId[anchorId];
    const coordId = getCoordId(coord);

    if (
      coords[coordId] && //coord is a used coordinate (remove multipleAnchor node)
      drawnElements[nodeId] && //parent is drawn (remove mono anchor node)
      !coords[coordId].name && //name is not already attributed
      nodeReference[nodeId].name //the parent has a name
    ) {
      coords[coordId].name = `${nodeReference[nodeId].name}.${name}`;
    }
  });

  // ====================================
  // 3. Draw path from multi-pole anchors
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
