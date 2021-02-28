import { isMultyPole, getElementAnchors } from "components";
import { isPath, findCommonAnchor, getCoordId } from "./utils";

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
          x: Math.round(fromCoord.x),
          y: Math.round(fromCoord.y),
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
          x: Math.round(toCoord.x),
          y: Math.round(toCoord.y),
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
            x: Math.round(positionCoord.x),
            y: Math.round(positionCoord.y),
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
        if (coordX === Math.round(anchorX) && coordY === Math.round(anchorY)) {
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

export default initializeCoords;
