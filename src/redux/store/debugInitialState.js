import { MODE_SELECT } from "./interactionModes";
import { default_displayOptions } from "./displayOptions";
import { default_magnetsOptions } from "./magnetsOptions";

export const initial_state = {
  displayOptions: default_displayOptions,
  magnetsOptions: default_magnetsOptions,
  mode: MODE_SELECT,
  selection: [],
  adhesivePoints: [],
  weakLinks: [],
  currentMagnet: {
    attractor: null,
    attracted: null,
  },
  components: {
    byId: {
      // id1: {
      //   id: "id1",
      //   from: "anchor1",
      //   to: "anchor3",
      //   type: "pR",
      //   currant: { ...defaultCurrant },
      // },
      // id2: {
      //   id: "id2",
      //   from: "anchor2",
      //   to: "anchor3",
      //   type: "empty led",
      //   currant: { ...defaultCurrant },
      // },
      // id3: {
      //   id: "id3",
      //   from: "anchor4",
      //   to: "anchor3",
      //   type: "lampe",
      //   label: "label",
      //   annotation: "annotation",
      //   currant: { ...defaultCurrant },
      //   mirror: false,
      //   invert: false,
      // },
      // id4: {
      //   id: "id4",
      //   from: "anchor5",
      //   to: "anchor3",
      //   type: "lampe",
      //   label: "label",
      //   annotation: "annotation",
      //   currant: { ...defaultCurrant },
      //   mirror: false,
      //   invert: false,
      // },
      id5: {
        id: "id5",
        position: "anchor6",
        type: "nmos",
        angle: -45,
      },
      id6: {
        id: "id6",
        position: "anchor7",
        type: "nmos",
        angle: "",
        positionAnchor: "",
      },
    },
    allIds: [
      // "id1", "id2", "id3", "id4",
      "id5",
      "id6",
    ],
  },
  coordinates: {
    byId: {
      // anchor1: {
      //   id: "anchor1",
      //   x: 10,
      //   y: 200,
      // },
      // anchor2: {
      //   id: "anchor2",
      //   x: 500,
      //   y: 200,
      // },
      // anchor3: {
      //   id: "anchor3",
      //   x: 250,
      //   y: 200,
      // },
      // anchor4: {
      //   id: "anchor4",
      //   x: 250,
      //   y: 400,
      // },
      // anchor5: {
      //   id: "anchor5",
      //   x: 250,
      //   y: 10,
      // },
      anchor6: {
        id: "anchor6",
        x: 100,
        y: 400,
        isNodePosition: true,
        nodeId: "id5",
      },
      anchor7: {
        id: "anchor7",
        x: 200,
        y: 400,
        isNodePosition: true,
        nodeId: "id6",
      },
    },
    allIds: [
      // "anchor1", "anchor2", "anchor3", "anchor4", "anchor5"
    ],
  },
};
