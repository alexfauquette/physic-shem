import { loadProject, listProjects } from "redux/actions";
import { openMessage } from "redux/actions/messages";
import { v4 as uuid } from "uuid";

const SUCCESS = "success";
const ERROR = "error";

const extractData = async (response) => {
  const returnedData = await response.json();
  const severity = response.ok ? SUCCESS : ERROR;

  return { severity, returnedData };
};

export const saveProject = ({ formData }) => async (dispatch, getState) => {
  const { components, coordinates } = getState();
  formData.append(
    "data",
    JSON.stringify({
      components,
      coordinates,
    })
  );
  const response = await fetch("https://amathjourney.com/api/circuits/", {
    method: "POST",
    body: formData,
  });

  const { severity, returnedData } = await extractData(response);

  dispatch(
    openMessage({
      id: uuid(),
      severity,
      text: returnedData.error || "project saved",
    })
  );
};

export const updateProject = ({ id, formData }) => async (
  dispatch,
  getState
) => {
  const { components, coordinates } = getState();

  formData.append(
    "data",
    JSON.stringify({
      components,
      coordinates,
    })
  );

  const response = await fetch(`https://amathjourney.com/api/circuits/${id}`, {
    method: "PUT",
    body: formData,
  });

  const { severity, returnedData } = await extractData(response);

  dispatch(
    openMessage({
      id: uuid(),
      severity,
      text: returnedData.error || "project updated",
    })
  );
};

export const deleteProject = ({ id, password, history }) => async (
  dispatch,
  getState
) => {
  const { components, coordinates } = getState();
  const data = {
    password,
  };
  const response = await fetch(`https://amathjourney.com/api/circuits/${id}`, {
    method: "DELETE",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const { severity, returnedData } = await extractData(response);

  dispatch(
    openMessage({
      id: uuid(),
      severity,
      text: returnedData.error || "project deleted",
    })
  );
  if (severity === SUCCESS) {
    history.push("/catalogue");
  }
};

export const getProjects = () => async (dispatch, getState) => {
  const rep = await fetch(`https://amathjourney.com/api/circuits/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonRep = await rep.json();
  if (jsonRep.length > 0) {
    dispatch(listProjects(jsonRep));
  }
};

export const getProject = (id = "") => async (dispatch, getState) => {
  if (!id) {
    dispatch(
      loadProject({
        id: "",
        username: "",
        circuitname: "",
        components: {
          byId: {},
          allIds: [],
        },
        coordinates: {
          byId: {},
          allIds: [],
        },
      })
    );
    return null;
  }

  const rep = await fetch(`https://amathjourney.com/api/circuits/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const jsonRep = await rep.json();

  if (
    jsonRep.length > 0 &&
    jsonRep[0].data &&
    jsonRep[0].data.components &&
    jsonRep[0].data.coordinates
  ) {
    dispatch(
      loadProject({
        id: jsonRep[0].id,
        username: jsonRep[0].username,
        circuitname: jsonRep[0].circuitname,
        components: jsonRep[0].data.components,
        coordinates: jsonRep[0].data.coordinates,
      })
    );
  }
};
