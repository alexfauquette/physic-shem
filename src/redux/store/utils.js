import { getElementAnchors, isPath } from "components";

export const getAdhesivePoints = (elementType) => {
  const adhesivePoints = [];
  if (isPath[elementType]) {
    adhesivePoints.push({
      type: "ANCHOR",
      id: null,
      dx: 0,
      dy: 0,
    });
  }

  const elementAnchors = getElementAnchors({
    type: elementType,
    fromCoords: { x: 0, y: 0 },
    toCoords: { x: 0, y: 0 },
    positionCoords: { x: 0, y: 0 },
  });

  elementAnchors.forEach(({ x, y, name }) => {
    adhesivePoints.push({
      type: isPath[elementType] ? "PATH" : "NODE", // TODO use constant file
      name: name,
      id: null,
      dx: -x,
      dy: -y,
    });
  });

  return adhesivePoints;
};

export const componentUseThisAnchor = (element, anchorId) => {
  if (element.from && element.from === anchorId) {
    return true;
  }
  if (element.to && element.to === anchorId) {
    return true;
  }
  if (element.position && element.position === anchorId) {
    return true;
  }
  return false;
};

export const replaceComponentAnchor = (
  element,
  previousAnchorId,
  newAnchorId
) => {
  const newElement = { ...element };
  if (element.from && element.from === previousAnchorId) {
    newElement.from = newAnchorId;
  }
  if (element.to && element.to === previousAnchorId) {
    newElement.to = newAnchorId;
  }
  if (element.position && element.position === previousAnchorId) {
    newElement.position = newAnchorId;
  }
  return { ...newElement };
};

export const isInRectangle = ({ x, y }, { x0, y0, x1, y1 }) => {
  return (
    Math.abs(x - x0) + Math.abs(x - x1) <= Math.abs(x1 - x0) &&
    Math.abs(y - y0) + Math.abs(y - y1) <= Math.abs(y1 - y0)
  );
};

export const isAnchor = (state, id) =>
  id !== null && state.coordinates.allIds.includes(id);
