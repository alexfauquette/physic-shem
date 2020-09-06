import React from "react";
import Container from "./container/index.js";
import { connect } from "react-redux";
import { startAddingElement } from "./redux/actions";

const mapDispatchToProps = (dispatch) => {
  return {
    startAdding: () => dispatch(startAddingElement("lampe")),
  };
};

function App({ startAdding }) {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={startAdding}>Start adding</button>
        <Container />
      </header>
    </div>
  );
}

export default connect(null, mapDispatchToProps)(App);
