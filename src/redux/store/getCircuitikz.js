import { drawElement } from "../../components";

const isNode = (element) => !!element.position;

function getCircuitikz(state) {
  const circuitText = ["\\begin{circuitikz}[american]"];

  state.pathComponents.allIds.forEach((elementId) => {
    const element = state.pathComponents.byId[elementId];
    if (isNode(element)) {
      circuitText.push(
        drawElement(element, state.anchors.byId[element.position])
      );
    } else {
      circuitText.push(
        drawElement(
          element,
          state.anchors.byId[element.from],
          state.anchors.byId[element.to]
        )
      );
    }
  });

  circuitText.push("\\end{circuitikz}");

  return circuitText;
}

export default getCircuitikz;
