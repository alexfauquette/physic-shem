import React from "react";
import { connect } from "react-redux";

import getCircuitikz from "../redux/store/getCircuitikz";

import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";

const copyCode = (code) => {
  navigator.clipboard.writeText(code).then(
    function () {
      alert("success");
    },
    function () {
      alert("a pb occurred");
    }
  );
};

const mapStateToProps = (state) => {
  return { code: getCircuitikz(state) };
};

const LatexDisplay = ({ code }) => (
  <>
    <DialogTitle>Your LaTEX code</DialogTitle>
    <DialogContent>
      <pre>
        {code.slice(0, code.length - 1).join("\n\t") +
          "\n" +
          code[code.length - 1]}
      </pre>
    </DialogContent>
    <DialogActions>
      <Button
        autoFocus
        onClick={() => {
          copyCode(
            code.slice(0, code.length - 1).join("\n\t") +
              "\n" +
              code[code.length - 1]
          );
        }}
      >
        Copy
      </Button>
    </DialogActions>
  </>
);

export default connect(mapStateToProps, null)(LatexDisplay);
