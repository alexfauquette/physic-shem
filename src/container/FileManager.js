import React, { useState, useRef, useEffect } from "react";

import { connect } from "react-redux";

import { loadProject } from "redux/actions";

import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import FileCopyIcon from "@material-ui/icons/FileCopy";

const mapStateToProps = (state) => {
  return {
    components: state.components,
    coordinates: state.coordinates,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    loadProject: ({ components, coordinates }) =>
      dispatch(loadProject({ components, coordinates })),
  };
};

const FileManager = ({ components, coordinates, loadProject, ...props }) => {
  const [isOpen, setIsOpen] = useState(false);
  const anchorEl = useRef();
  const [href, setHref] = useState("");

  useEffect(() => {
    setHref(
      "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify({ components, coordinates }))
    );
  }, [components, coordinates]);

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
      </Menu>
    </>
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(FileManager);
