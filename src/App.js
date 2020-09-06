import React from "react";
import Container from "./container/index.js";
import { connect } from "react-redux";
import { startAddingElement, resetState } from "./redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    startAdding: () => dispatch(startAddingElement("lampe")),
    resetState: () => dispatch(resetState()),
  };
};

function App({ startAdding, resetState }) {
  return (
    // TODO : Proper listen key event
    <div className="App" onKeyDown={resetState} tabIndex="0">
      <header className="App-header">
        <button onClick={startAdding}>Start adding</button>
        <Container />
      </header>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(App);
