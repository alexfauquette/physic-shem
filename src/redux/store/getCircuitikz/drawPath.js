import { getPoles, getCoordId, getCoord, removeDrawnElements } from "./utils";
import { drawElement } from "components";
// this function start from the coordinate "startCoordId" and follow a path by drawing components
const drawPathFromCoord = (
  startCoordId,
  coords,
  state,
  drawnElements,
  nbOfCoordinateUsed
) => {
  const elementsToAdd = []; // list of the elements in the line to write
  let previousCoord = {};

  // variables to save some coordinates
  let nbOfCreatedNames = 0;
  let nextName = `point${nbOfCoordinateUsed + 1}`;

  // create variable updatable
  let currantCoordId = startCoordId;
  let currantCoord = coords[currantCoordId];

  // informations on the currant coord :
  // path to start here, to finish here and node to draw here
  let nextPaths = removeDrawnElements(drawnElements)(
    currantCoord.startingPaths
  );
  let arrivingPaths = removeDrawnElements(drawnElements)(
    currantCoord.endingPaths
  );

  let nextNode = removeDrawnElements(drawnElements)(
    currantCoord.nodeAssociated
  );

  let coordIsNew = true; // this is for node because after drawing a node we are still at the same coordinate
  while (nextPaths.length > 0 || nextNode.length > 0) {
    // add draw if it's the beginning
    if (elementsToAdd.length === 0) {
      elementsToAdd.push(`\\draw `);
    }

    // add the coordinate if needed
    if (coordIsNew) {
      elementsToAdd.push(
        `${getCoord(currantCoord.x, currantCoord.y, coords, previousCoord)} `
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
      const element = state.components.byId[nodeId];

      elementsToAdd.push(`${drawElement(element)} `);
      drawnElements[element.id] = true;
    } else {
      // create path if no more node is to draw
      coordIsNew = true;
      const element = state.components.byId[nextPaths[0]];

      element.poles = getPoles(
        state.coordinates.byId[element.from],
        state.coordinates.byId[element.to]
      );
      elementsToAdd.push(drawElement(element));
      drawnElements[element.id] = true;

      // get information of the next coordinate
      previousCoord = { ...currantCoord };

      currantCoordId = getCoordId(state.coordinates.byId[element.to]);
      currantCoord = coords[currantCoordId];
      nextPaths = removeDrawnElements(drawnElements)(
        currantCoord.startingPaths
      );
      arrivingPaths = removeDrawnElements(drawnElements)(
        currantCoord.endingPaths
      );
      nextNode = removeDrawnElements(drawnElements)(
        currantCoord.nodeAssociated
      );
    }
  }

  // We exit the while. So there is no elements to draw from the currant coordinate

  if (elementsToAdd.length > 0) {
    //check that we added something
    if (coordIsNew) {
      // if it's a new coordinate, we add it to the list
      elementsToAdd.push(
        `${getCoord(currantCoord.x, currantCoord.y, coords, previousCoord)} `
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

export default drawPathFromCoord;
