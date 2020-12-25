import React, { useState } from "react";

import { connect } from "react-redux";
import {
  startCreatePathElement,
  startCreateNodeElement,
} from "../redux/actions";

import { isPath, structure } from "../components";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";

const mapDispatchToProps = (dispatch) => {
  return {
    startCreatePathElement: (elementType) =>
      dispatch(startCreatePathElement(elementType)),
    startCreateNodeElement: (elementType) =>
      dispatch(startCreateNodeElement(elementType)),
  };
};

const LeftMenu = ({ startCreatePathElement, startCreateNodeElement }) => {
  const [openSection, setOpenSection] = useState();

  return (
    <List>
      {Object.keys(structure).map((sectionName) => (
        <>
          <ListItem
            key={sectionName}
            button
            onClick={() =>
              setOpenSection(openSection === sectionName ? null : sectionName)
            }
          >
            <ListItemText primary={sectionName} />
            {openSection === sectionName ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse
            in={openSection === sectionName}
            timeout="auto"
            unmountOnExit
          >
            <List>
              {structure[sectionName].map((name) => (
                <ListItem
                  button
                  key={name}
                  onMouseDown={(event) => {
                    event.stopPropagation();
                    if (isPath[name]) {
                      startCreatePathElement(name);
                    } else {
                      startCreateNodeElement(name);
                    }
                  }}
                >
                  <ListItemText
                    primary={name}
                    style={{ paddingLeft: "20px" }}
                  />
                </ListItem>
              ))}
            </List>
          </Collapse>
        </>
      ))}
    </List>
  );
};

export default connect(null, mapDispatchToProps)(LeftMenu);
