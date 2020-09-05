import React, { useState } from "react";
import Container from "./container/index.js";
import Lampe from "./components/Lampe";

function App() {
  const [x, setX] = useState(30);

  return (
    <div className="App">
      <header className="App-header">
        <Container>
          <Lampe x={x} y={50} onClick={() => setX(x + 10)} />
        </Container>
      </header>
    </div>
  );
}

export default App;
