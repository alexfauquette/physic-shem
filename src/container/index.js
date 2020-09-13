import React, { useState, useEffect } from "react";
import components from "../components";
import { connect } from "react-redux";
import {
  addElement,
  startDragging,
  selectElement,
  stopDraging,
} from "../redux/actions";
import { MODE_ADD, MODE_SELECT, MODE_DRAG } from "../redux/store";

const STEP = 10;

const mapDispatchToProps = (dispatch) => {
  return {
    addElement: (x, y) => dispatch(addElement(x, y)),
    startDragging: () => dispatch(startDragging()),
    select: (objectId, ctrlPressed) =>
      dispatch(selectElement(objectId, ctrlPressed)),
    stopDraging: (dx, dy) => dispatch(stopDraging(dx, dy)),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({
  mode,
  scene,
  selection,
  addElement,
  startDragging,
  select,
  stopDraging,
}) => {
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
        break;
      default:
        break;
    }
  };

  const startDrag = (event) => {
    startDragging();
    setDrag({
      xOrigine: event.nativeEvent.offsetX,
      yOrigine: event.nativeEvent.offsetY,
      x: event.nativeEvent.offsetX,
      y: event.nativeEvent.offsetY,
    });
  };
  return (
    <>
      <p>{mode}</p>
      <p>{selection}</p>
      <p>{Object.keys(scene)}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 300"
        style={{ width: 500, height: 300 }}
        onMouseMove={
          mode === MODE_ADD || mode === MODE_DRAG ? followMouse : null
        }
        onClick={
          mode === MODE_ADD && coords.x && coords.y
            ? () => addElement(coords.x, coords.y)
            : null
        }
        onMouseLeave={mode === MODE_DRAG ? () => stopDraging() : null}
        onMouseUp={
          mode === MODE_DRAG
            ? (event) =>
                stopDraging(
                  event.nativeEvent.offsetX - drag.xOrigine,
                  event.nativeEvent.offsetY - drag.yOrigine
                )
            : null
        }
      >
        <text>{mode}</text>
        {Object.keys(scene)
          .filter((id) => mode !== MODE_DRAG || !selection.includes(id))
          .map(
            (id) =>
              scene[id].type &&
              components[scene[id].type]({
                id,
                onClick: () => {
                  console.log("jdhskjhjfkhskjfhkd");
                },
                onMouseDown:
                  mode === MODE_SELECT
                    ? selection.includes(id)
                      ? startDrag
                      : (event) => select(id, event.ctrlKey)
                    : null,

                selected: selection.includes(id),
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
            {selection.map((id) =>
              components[scene[id].type]({
                id: id,
              })
            )}
          </g>
        )}
      </svg>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
