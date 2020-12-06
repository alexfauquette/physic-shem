import { MODE_SELECT } from "./interactionModes";

export const initial_state = {
  mode: MODE_SELECT,
  selection: [],
  adhesivePoints: [],
  weakLinks: [],
  currentMagnet: {
    attractor: null,
    attracted: null,
  },
  pathComponents: {
    byId: {
      id1: {
        id: "id1",
        from: "anchor1",
        to: "anchor3",
        type: "pR",
      },
      id2: {
        id: "id2",
        from: "anchor2",
        to: "anchor3",
        type: "empty led",
      },
      id3: {
        id: "id3",
        from: "anchor4",
        to: "anchor3",
        type: "lampe",
      },
      id4: {
        id: "id4",
        from: "anchor5",
        to: "anchor3",
        type: "lampe",
      },
      id5: {
        id: "id5",
        position: "anchor6",
        type: "nmos",
        angle: -45,
        positionAnchor: "B",
      },
      id6: {
        id: "id6",
        position: "anchor7",
        type: "nmos",
        angle: "",
        positionAnchor: "",
      },
    },
    allIds: ["id1", "id2", "id3", "id4", "id5", "id6"],
  },
  anchors: {
    byId: {
      anchor1: {
        id: "anchor1",
        x: 10,
        y: 200,
      },
      anchor2: {
        id: "anchor2",
        x: 500,
        y: 200,
      },
      anchor3: {
        id: "anchor3",
        x: 250,
        y: 200,
      },
      anchor4: {
        id: "anchor4",
        x: 250,
        y: 400,
      },
      anchor5: {
        id: "anchor5",
        x: 250,
        y: 10,
      },
      anchor6: {
        id: "anchor6",
        x: 100,
        y: 400,
        isNodePosition: true,
      },
      anchor7: {
        id: "anchor7",
        x: 100,
        y: 400,
        isNodePosition: true,
      },
    },
    allIds: ["anchor1", "anchor2", "anchor3", "anchor4", "anchor5"],
  },
};
