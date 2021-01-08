import { getElementAnchors } from "components";
import { MULTIPLICATIVE_CONST } from "utils";

const EPSILON = 0.01;

export const isNode = (element) => !!element.position;

export const isPath = (element) => !!element.to && !!element.from;

export const findCommonAnchor = (node1, node2) => {
  // get two nodes element object
  //   if they have anchors ate the same coordinate, it returns {parentAnchor, childAnchor}
  //    - parentAnchor is the name of the node1 anchor
  //    - childAnchor is the name of the node2 anchor
  //   otherwise it reurns empty object

  const anchors1 = getElementAnchors(node1);
  const anchors2 = getElementAnchors(node2);

  const rep = {};
  anchors1.forEach(({ name: name1, x: x1, y: y1 }) => {
    anchors2.forEach(({ name: name2, x: x2, y: y2 }) => {
      if (Math.abs(x1 - x2) < EPSILON && Math.abs(y1 - y2) < EPSILON) {
        rep.parentAnchor = name1;
        rep.childAnchor = name2;
      }
    });
  });

  return rep;
};

export const fillCoordWithAnchorsName = (
  multipoleNodes,
  coords,
  nodeReference
) => {
  // Inputs :
  //    - multiploeNodes is a list of nodes objects
  //    - coords is an object of all the coords to use
  //    - nodeReference is an object with information on nodes to draw
  // If an anchor can be used as a coordinate, we givethe correct name to this coordinate

  multipoleNodes.forEach((node) => {
    const anchors = getElementAnchors(node);
    anchors.forEach(({ name: anchorName, x, y }) => {
      const coordId = getCoordId({ x, y });

      if (coords[coordId] !== undefined && !coords[coordId].name) {
        coords[coordId].name = `${nodeReference[node.id].name}.${anchorName}`;
      }
    });
  });
};

export const getPoles = ({ shape: shapeFrom }, { shape: shapeTo }) => {
  // take in input coordinates objects fromCoords and toCoords of a path element
  // return the string to set in order to have the correct shapes

  // TODO could be improved : if for example the starting position is already a diamond, it should be -o and not d-o
  const useStart = ["*", "o", "d"].includes(shapeFrom);
  const useEnd = ["*", "o", "d"].includes(shapeTo);
  if (useStart || useEnd) {
    return `${useStart ? shapeFrom : ""}-${useEnd ? shapeTo : ""}`;
  } else {
    return "";
  }
};

export const simplifyNumber = (x) => {
  // round number to 0.01 precision without useless 0
  const rep = x.toFixed(2);
  if (rep.slice(-3) === ".00") {
    return rep.slice(0, -3);
  }
  if (rep.slice(-1) === "0") {
    return rep.slice(0, -1);
  }
  return rep;
};

export const getCoordId = ({ x, y }) =>
  `${typeof x === "number" ? x.toFixed(2) : x}-${
    typeof y === "number" ? y.toFixed(2) : y
  }`;

// helper to write latex coordinate
export const getCoord = (x, y, coords) => {
  const coordId = getCoordId({ x: x, y: y });

  if (coords[coordId].name) {
    return `(${coords[coordId].name})`;
  } else {
    return `(${simplifyNumber(x / MULTIPLICATIVE_CONST)}, ${simplifyNumber(
      -y / MULTIPLICATIVE_CONST
    )})`;
  }
};

// function to filter elements in drawnElements from a listOfId
export const removeDrawnElements = (drawnElements) => (listeOfId) =>
  listeOfId.filter((id) => !drawnElements[id]);

// comparing function to decide which coordinate should be drawn first
export const compareCoord = (drawnElements, coords) => (coordId1, coordId2) => {
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
