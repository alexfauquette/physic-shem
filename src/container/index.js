import React, { useState, useEffect } from "react";
import components from "../components";
import { connect } from "react-redux";
import { addElement } from "../redux/actions";
import { MODE_ADD } from "../redux/store";

const STEP = 10;

const mapDispatchToProps = (dispatch) => {
  return {
    addElement: (x, y) => dispatch(addElement(x, y)),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({ mode, scene, selection, addElement }) => {
  const [coords, setCoords] = useState({ x: undefined, y: undefined });
  useEffect(() => {
    setCoords({ x: undefined, y: undefined });
  }, [mode]);

  const followMouse = (event) => {
    const newCoords = {
      x:
        event.nativeEvent.offsetX -
        (event.nativeEvent.offsetX % STEP) +
        (event.nativeEvent.offsetX % STEP > STEP / 2 ? STEP : 0),
      y:
        event.nativeEvent.offsetY -
        (event.nativeEvent.offsetY % STEP) +
        (event.nativeEvent.offsetY % STEP > STEP / 2 ? STEP : 0),
    };
    if (newCoords.x !== coords.x || newCoords.y !== coords.y) {
      setCoords(newCoords);
    }
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 300"
      style={{ width: 500, height: 300 }}
      onMouseMove={mode === MODE_ADD ? followMouse : null}
      onClick={
        mode === MODE_ADD && coords.x && coords.y
          ? () => addElement(coords.x, coords.y)
          : null
      }
    >
      {/* <p>{scene}</p> */}
      {Object.keys(scene).map(
        (id) => scene[id].type && components[scene[id].type]({ id })
      )}
      {mode === MODE_ADD && components[selection[0]]({ ...coords })}
    </svg>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
