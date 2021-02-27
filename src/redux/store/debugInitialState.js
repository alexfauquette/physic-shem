import { MODE_SELECT } from "./interactionModes";
import { default_displayOptions } from "./displayOptions";
import { default_magnetsOptions } from "./magnetsOptions";

export const initial_state = {
  displayOptions: default_displayOptions,
  magnetsOptions: default_magnetsOptions,
  mode: MODE_SELECT,
  currentProject: {
    id: "",
    username: "",
    circuitname: "",
  },
  selection: [],
  adhesivePoints: [],
  weakLinks: [],
  currentMagnet: {
    attractor: null,
    attracted: null,
  },
  components: {
    byId: {},
    allIds: [],
  },
  coordinates: {
    byId: {},
    allIds: [],
  },
};
