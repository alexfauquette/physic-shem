import React, { useState, useEffect } from "react";
import components from "../components";
import { connect } from "react-redux";
import { addElement, startDragging } from "../redux/actions";
import { MODE_ADD, MODE_SELECT, MODE_DRAG } from "../redux/store";

const STEP = 10;

const mapDispatchToProps = (dispatch) => {
  return {
    addElement: (x, y) => dispatch(addElement(x, y)),
    startDragging: (objectId) => dispatch(startDragging(objectId)),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({ mode, scene, selection, addElement, startDragging }) => {
  const [coords, setCoords] = useState({ x: undefined, y: undefined });
  useEffect(() => {
    setCoords({ x: undefined, y: undefined });
  }, [mode]);

  const [drag, setDrag] = useState({ x: 0, y: 0, xOrigine: 0, yOrigine: 0 });
  useEffect(() => {
    if (mode !== MODE_DRAG) {
      setDrag({ x: 0, y: 0, xOrigine: 0, yOrigine: 0 });
    }
  }, [mode]);

  const followMouse = (event) => {
    switch (mode) {
      case MODE_ADD:
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
        break;
      case MODE_DRAG:
        console.log(drag);
        setDrag({
          ...drag,
          x: event.nativeEvent.offsetX,
          y: event.nativeEvent.offsetY,
        });
      default:
        break;
    }
  };

  const startDrag = (objectId) => (event) => {
    startDragging(objectId);
    setDrag({
      xOrigine: event.nativeEvent.offsetX,
      yOrigine: event.nativeEvent.offsetY,
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 500 300"
      style={{ width: 500, height: 300 }}
      onMouseMove={mode === MODE_ADD || mode === MODE_DRAG ? followMouse : null}
      onClick={
        mode === MODE_ADD && coords.x && coords.y
          ? () => addElement(coords.x, coords.y)
          : null
      }
    >
      <text>{mode}</text>
      {Object.keys(scene)
        .filter((id) => !selection.includes(id))
        .map(
          (id) =>
            scene[id].type &&
            components[scene[id].type]({
              id,
              onMouseDown: mode === MODE_SELECT ? startDrag(id) : null,
            })
        )}
      {mode === MODE_ADD && components[selection[0]]({ ...coords })}
      {mode === MODE_DRAG && (
        <g
          style={{
            transform: `translate(${drag.x - drag.xOrigine}px, ${
              drag.y - drag.yOrigine
            }px)`,
          }}
        >
          {components[scene[selection[0]].type]({ id: selection[0] })}
        </g>
      )}
    </svg>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
