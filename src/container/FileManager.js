import React, { useState, useRef, useEffect, useCallback } from "react";
import rough from "roughjs/bundled/rough.esm.js";

import { roughComponents } from "components";
import { roughCoordinate } from "atoms/anchor";

import { connect } from "react-redux";

import { loadProject } from "redux/actions";
import {
  updateProject,
  saveProject,
  deleteProject,
} from "redux/apiInteractions";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";

import FileCopyIcon from "@material-ui/icons/FileCopy";

// size of the image to represent the circuit
const MAX_HEIGHT = 300;
const MAX_WIDTH = 500;

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(",")[0].indexOf("base64") >= 0)
    byteString = atob(dataURI.split(",")[1]);
  else byteString = unescape(dataURI.split(",")[1]);

  // separate out the mime component
  var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], { type: mimeString });
}

const mapStateToProps = (state) => {
  return {
    components: state.components,
    coordinates: state.coordinates,
    currentProject: state.currentProject,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProject: ({ components, coordinates }) =>
      dispatch(loadProject({ components, coordinates })),
    saveProject: ({ formData }) => dispatch(saveProject({ formData })),
    updateProject: ({ id, formData }) =>
      dispatch(updateProject({ id, formData })),
    deleteProject: ({ id, password }) =>
      dispatch(deleteProject({ id, password })),
  };
};

const SaveOnline = ({
  open,
  toDelete,
  setOpen,
  updateProject,
  saveProject,
  deleteProject,
  currentProject = {},
  components,
  coordinates,
}) => {
  const id = (currentProject && currentProject.id) || "";
  const [canvasUrl, setCanvasUrl] = useState("");
  const [erase, setErase] = useState(id !== "");

  const [circuitname, setCircuitname] = useState(
    (currentProject && currentProject.circuitname) || ""
  );
  const [username, setUsername] = useState(
    (currentProject && currentProject.username) || ""
  );
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  useEffect(() => {
    setCircuitname((currentProject && currentProject.circuitname) || "");
    setUsername((currentProject && currentProject.username) || "");
  }, [currentProject.id, currentProject.circuitname, currentProject.username]);

  const canvasRef = useCallback(
    (canvasNode) => {
      const margin = 10;
      if (canvasNode) {
        const svgBBox = document.getElementById("drawingArea").getBBox();

        const width = svgBBox.width;
        const height = svgBBox.height;

        const height_ratio = MAX_HEIGHT / (height + 2 * margin);
        const width_ratio = MAX_WIDTH / (width + 2 * margin);
        const ratio = Math.min(1, Math.min(height_ratio, width_ratio));

        const rc = rough.canvas(canvasNode, {
          options: { seed: 1, roughness: 0, curveFitting: 1 },
        });

        canvasNode.width = ratio * (width + 2 * margin);
        canvasNode.height = ratio * (height + 2 * margin);
        const ctx = canvasNode.getContext("2d");
        ctx.scale(ratio, ratio);

        ctx.font = "0.7cm IndieFlower";

        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, width + 2 * margin, height + 2 * margin);
        ctx.fillStyle = "black";

        components.allIds.forEach((id) => {
          const element = components.byId[id];
          element.positionCoords = element.position
            ? coordinates.byId[element.position]
            : undefined;
          element.fromCoords = element.from
            ? coordinates.byId[element.from]
            : undefined;
          element.toCoords = element.to
            ? coordinates.byId[element.to]
            : undefined;

          roughComponents(
            rc,
            ctx,
            svgBBox.x - margin,
            svgBBox.y - margin,
            element
          );
        });

        coordinates.allIds.forEach((id) => {
          const element = coordinates.byId[id];
          roughCoordinate(
            rc,
            ctx,
            svgBBox.x - margin,
            svgBBox.y - margin,
            element
          );
        });

        setCanvasUrl(canvasNode.toDataURL("image/png"));
      }
    },
    [components, coordinates]
  );

  return (
    <Dialog maxWidth="xs" open={open} aria-labelledby="form-dialog-title">
      <DialogTitle id="form-dialog-title">
        {toDelete ? "Delete circuit" : "Save circuit"}
      </DialogTitle>
      <DialogContent>
        {!toDelete && (
          <>
            <TextField
              autoFocus
              margin="dense"
              id="userName"
              label="user name"
              type="text"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                console.log("value", e.target.value);
                e.stopPropagation();
              }}
              fullWidth
            />
            <TextField
              margin="dense"
              id="circuitName"
              label="circuit name"
              type="text"
              value={circuitname}
              onChange={(e) => setCircuitname(e.target.value)}
              fullWidth
            />
          </>
        )}
        <TextField
          margin="dense"
          id="password"
          label="password"
          type="password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
          fullWidth
        />
        {!toDelete && (
          <TextField
            margin="dense"
            id="confirmPassword"
            label="confirm password"
            type="password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            disabled={erase}
            error={!erase && password1 !== password2}
            helperText={"must be the same password"}
            fullWidth
          />
        )}
        {id !== "" ? (
          !toDelete && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={erase}
                  onChange={(e) => setErase(e.target.checked)}
                />
              }
              label={
                <>
                  Erase the original schema<br></br>(you need the password)
                </>
              }
            />
          )
        ) : (
          <p>(Password will be necessary to modify your circuit later)</p>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpen(false)} color="primary">
          Cancel
        </Button>
        <Button
          onClick={() => {
            setOpen(false);
            const fd = new FormData();

            fd.append("username", username);
            fd.append("circuitname", circuitname);
            fd.append("password", password1);
            fd.append("file", dataURItoBlob(canvasUrl), "image.png");
            if (id && toDelete) {
              deleteProject({ id, password: password1 });
            } else if (id && erase) {
              updateProject({ id, formData: fd });
            } else if (password1 === password2) {
              saveProject({ formData: fd });
            }
          }}
          color="primary"
        >
          {id && toDelete ? "Delete" : "Save"}
        </Button>
      </DialogActions>
      {/* canvas used to compute the image to upload */}
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Dialog>
  );
};

const FileManager = ({
  components,
  coordinates,
  currentProject,
  loadProject,
  updateProject,
  saveProject,
  deleteProject,
  ...props
}) => {
  const [openDialogue, setOpenDialogue] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [toDelete, setToDelete] = useState(false);

  const anchorEl = useRef();
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(
      "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ components, coordinates }))
    );
  }, [components, coordinates]);

  // when the modal is closed we set delete to false
  useEffect(() => {
    if (isOpen === false) {
      setToDelete(false);
    }
  }, [isOpen]);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  const handleUpload = (uploadedFile) => {
    const fileReader = new FileReader();

    fileReader.onloadend = () => {
      try {
        const data = JSON.parse(fileReader.result);
        if (data.components && data.coordinates) {
          loadProject(data);
        }
      } catch (e) {
        console.log("not a json");
      }
    };

    if (uploadedFile !== undefined) fileReader.readAsText(uploadedFile);
  };

  return (
    <>
      <IconButton
        {...props}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={isOpen ? close : open}
        ref={anchorEl}
      >
        <FileCopyIcon />
      </IconButton>
      <Menu anchorEl={anchorEl.current} open={isOpen} onClose={close}>
        <ListSubheader>Local</ListSubheader>
        <div>
          <input
            id="contained-button-file"
            type="file"
            style={{ display: "none" }}
            onChange={(e) => {
              handleUpload(e.target.files[0]);
            }}
          />
          <label htmlFor="contained-button-file">
            <MenuItem variant="contained" color="primary" component="span">
              Open
            </MenuItem>
          </label>
        </div>
        <MenuItem
          component="a"
          color="primary"
          href={href}
          download="circuit.physSchem"
        >
          Save
        </MenuItem>
        <Divider />
        <ListSubheader>Online</ListSubheader>
        <MenuItem color="primary" onClick={() => setOpenDialogue(true)}>
          Save Online
        </MenuItem>
        <MenuItem
          color="primary"
          onClick={() => {
            setOpenDialogue(true);
            setToDelete(true);
          }}
        >
          Delete Online
        </MenuItem>
      </Menu>
      <SaveOnline
        updateProject={updateProject}
        saveProject={saveProject}
        deleteProject={deleteProject}
        currentProject={currentProject}
        open={openDialogue}
        toDelete={toDelete}
        setOpen={setOpenDialogue}
        components={components}
        coordinates={coordinates}
      />
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
