import React from "react";
import { connect } from "react-redux";

import {
  setZoom,
  setModeMovePaper,
  startSelect,
  stackSelectedAnchors,
  updateMagnetOption,
  startCreatePathElement,
} from "redux/actions";
import { MODE_MOVE_PAPER, MODE_SELECT } from "redux/store/interactionModes";

import SvgIcon from "@material-ui/core/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

import ControlCameraIcon from "@material-ui/icons/ControlCamera";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";

const mapDispatchToProps = (dispatch) => {
  return {
    startCreatePathElement: (name) => dispatch(startCreatePathElement(name)),
    setZoom: (zoom) => dispatch(setZoom(zoom)),
    setModeMovePaper: () => dispatch(setModeMovePaper()),
    startSelect: () => dispatch(startSelect()),
    stackSelectedAnchors: (direction) =>
      dispatch(stackSelectedAnchors(direction)),
    updateMagnetOption: (optionName, optionValue = null) =>
      dispatch(updateMagnetOption(optionName, optionValue)),
  };
};
const mapStateToProps = (state) => {
  return {
    mode: state.mode,
    zoom: state.displayOptions.zoom,
    magnetsOptions: state.magnetsOptions,
  };
};

const ToolBar = ({
  mode,
  zoom,
  magnetsOptions,
  startCreatePathElement,
  setZoom,
  setModeMovePaper,
  startSelect,
  stackSelectedAnchors,
  updateMagnetOption,
}) => {
  return (
    <div
      style={{
        position: "sticky",
        top: "64px",
        padding: "8px 2px",
        backgroundColor: "#fafafa",
      }}
    >
      <IconButton
        onMouseDown={(event) => {
          startCreatePathElement("short");
          event.stopPropagation();
        }}
      >
        <SvgIcon>
          <circle cx="4" cy="20" r="2" />
          <circle cx="20" cy="4" r="2" />
          <path d="M 19.5,3.5 3.5,19.5 l 1,1 L 20.5,4.5 Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          startCreatePathElement("upRight");
          event.stopPropagation();
        }}
      >
        <SvgIcon>
          <circle cx="4" cy="20" r="2" />
          <circle cx="20" cy="4" r="2" />
          <path d="M 20,3.5 H 3.5 V 20 h 1 V 4.5 H 20 Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          startCreatePathElement("rightUp");
          event.stopPropagation();
        }}
      >
        <SvgIcon>
          <circle cx="4" cy="20" r="2" />
          <circle cx="20" cy="4" r="2" />
          <path d="M 5,20.5 20.5,20.5 l 0,-16.5 h -1 L 19.5,19.5 l -15.5,0 z" />
        </SvgIcon>
      </IconButton>
      |
      <IconButton
        color={mode === MODE_SELECT ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          startSelect();
        }}
      >
        <SvgIcon>
          <path d="M10.07,14.27C10.57,14.03 11.16,14.25 11.4,14.75L13.7,19.74L15.5,18.89L13.19,13.91C12.95,13.41 13.17,12.81 13.67,12.58L13.95,12.5L16.25,12.05L8,5.12V15.9L9.82,14.43L10.07,14.27M13.64,21.97C13.14,22.21 12.54,22 12.31,21.5L10.13,16.76L7.62,18.78C7.45,18.92 7.24,19 7,19A1,1 0 0,1 6,18V3A1,1 0 0,1 7,2C7.24,2 7.47,2.09 7.64,2.23L7.65,2.22L19.14,11.86C19.57,12.22 19.62,12.85 19.27,13.27C19.12,13.45 18.91,13.57 18.7,13.61L15.54,14.23L17.74,18.96C18,19.46 17.76,20.05 17.26,20.28L13.64,21.97Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        color={mode === MODE_MOVE_PAPER ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          if (mode === MODE_MOVE_PAPER) {
            startSelect();
          } else {
            setModeMovePaper();
          }
        }}
      >
        <ControlCameraIcon />
      </IconButton>
      <IconButton
        disabled={zoom < 0.2}
        onMouseDown={(event) => {
          event.stopPropagation();
          setZoom(zoom / 2);
        }}
      >
        <ZoomOutIcon />
      </IconButton>
      {zoom}
      <IconButton
        disabled={zoom > 2}
        onMouseDown={(event) => {
          event.stopPropagation();
          setZoom(zoom * 2);
        }}
      >
        <ZoomInIcon />
      </IconButton>
      |
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("L");
        }}
      >
        <SvgIcon>
          <path d="M22 13V19H6V13H22M6 5V11H16V5H6M2 2V22H4V2H2" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("R");
        }}
      >
        <SvgIcon>
          <path d="M18 13V19H2V13H18M8 5V11H18V5H8M20 2V22H22V2H20Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("U");
        }}
      >
        <SvgIcon>
          <path d="M11 22H5V6H11V22M19 6H13V16H19V6M22 2H2V4H22V2Z" />
        </SvgIcon>
      </IconButton>
      <IconButton
        onMouseDown={(event) => {
          event.stopPropagation();
          stackSelectedAnchors("D");
        }}
      >
        <SvgIcon>
          <path d="M11 18H5V2H11V18M19 8H13V18H19V8M22 20H2V22H22V20Z" />
        </SvgIcon>
      </IconButton>
      |
      <IconButton
        color={magnetsOptions.isGridAttracting ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isGridAttracting");
        }}
      >
        <SvgIcon>
          <path d="M0 6v1h24v-1ZM0 12v1h24v-1ZM0 18v1h24v-1Z" />
          <path d="M4 0h1v24h-1ZM11 0h1v24h-1ZM18 0h1v24h-1Z" />
          <circle cx={18.5} cy={18.5} r={3} />
        </SvgIcon>
      </IconButton>
      <Select
        value={magnetsOptions.gridSpace}
        onChange={(event) =>
          updateMagnetOption("gridSpace", event.target.value)
        }
        onMouseDown={(event) => {
          event.stopPropagation();
        }}
      >
        <MenuItem value={0.5}>0.5cm</MenuItem>
        <MenuItem value={1}>1cm</MenuItem>
        <MenuItem value={2}>2cm</MenuItem>
      </Select>
      <IconButton
        color={
          magnetsOptions.isPathCoordinatesAttracting ? "secondary" : "default"
        }
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isPathCoordinatesAttracting");
        }}
      >
        <SvgIcon>
          <path d="M4 11.5h20v1h-20Z" />

          <circle cx={2} cy={12} r={2} />
          <circle cx={22} cy={12} r={2} />
        </SvgIcon>
      </IconButton>
      <IconButton
        color={magnetsOptions.isNodeAnchorsAttracting ? "secondary" : "default"}
        onMouseDown={(event) => {
          event.stopPropagation();
          updateMagnetOption("isNodeAnchorsAttracting");
        }}
      >
        <SvgIcon>
          <circle id="path858" cx="2" cy="16.5" r="2" />
          <circle id="path834" cx="2" cy="7.5" r="2" />
          <circle id="path838" cx="22" cy="12" r="2" />
          <path d="m 22,11.5 v 1 L 18.5,12.5 7,21 7,17 H 2 V 16 H 7 L 7,8 H 2 v -1 L 7,7 7,3 18.5,11.5 Z" />
        </SvgIcon>
      </IconButton>
    </div>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(ToolBar);
