import React from "react";
import { connect } from "react-redux";

import { closeAndDeleteMessage } from "redux/actions/messages";

import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

const mapStateToProps = (state) => {
  return { messages: state.messages || {} };
};

const mapDispatchToProps = (dispatch) => {
  return { closeAndDeleteMessage: (id) => dispatch(closeAndDeleteMessage(id)) };
};

const Messages = ({ messages, closeAndDeleteMessage }) => {
  return (
    <>
      {Object.keys(messages).map((id) => {
        const { text, severity, show } = messages[id];
        return (
          <Snackbar
            key={id}
            open={show}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
            autoHideDuration={10000}
          >
            <MuiAlert
              elevation={6}
              severity={severity}
              onClose={() => closeAndDeleteMessage(id)}
            >
              {text}
            </MuiAlert>
          </Snackbar>
        );
      })}
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
