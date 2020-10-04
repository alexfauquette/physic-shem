import React, { useState, useEffect } from "react";
import components from "../components";
import { connect } from "react-redux";
import {
  addElement,
  startDragging,
  selectElement,
  stopDraging,
  toggleLinkStep,
} from "../redux/actions";
import { MODE_ADD, MODE_SELECT, MODE_DRAG, MODE_LINK } from "../redux/store";
import Components from "./components";
import Links, { Link } from "./links";
import { v4 as uuid } from "uuid";

const STEP = 50;

const mapDispatchToProps = (dispatch) => {
  return {
    addElement: (x, y) => dispatch(addElement(x, y)),
    startDragging: () => dispatch(startDragging()),
    select: (objectId, ctrlPressed) =>
      dispatch(selectElement(objectId, ctrlPressed)),
    stopDraging: (dx, dy) => dispatch(stopDraging(dx, dy)),
    toggleLinkStep: (id, x, y) => dispatch(toggleLinkStep(id, x, y)),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({
  mode,
  scene,
  selection,
  currentLink,
  addElement,
  startDragging,
  select,
  stopDraging,
  toggleLinkStep,
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
      case MODE_LINK:
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

        if (
          mode === MODE_ADD &&
          (newCoords.x !== coords.x || newCoords.y !== coords.y)
        ) {
          setCoords(newCoords);
        } else if (
          mode === MODE_LINK &&
          (newCoords.x !== coords.x || newCoords.y !== coords.y)
        ) {
          const dx = newCoords.x - currentLink[currentLink.length - 1].x;
          const dy = newCoords.y - currentLink[currentLink.length - 1].y;

          if (Math.abs(dx) > Math.abs(dy)) {
            setCoords({
              x: newCoords.x,
              y: currentLink[currentLink.length - 1].y,
            });
          } else {
            setCoords({
              x: currentLink[currentLink.length - 1].x,
              y: newCoords.y,
            });
          }
        }
        break;
      case MODE_DRAG:
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
      <p>
        {scene
          .filter(
            (element) => mode !== MODE_DRAG || !selection.includes(element.id)
          )
          .map((element) => element.type)}
      </p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 300"
        style={{ width: 500, height: 300 }}
        onMouseMove={
          mode === MODE_ADD || mode === MODE_DRAG || mode === MODE_LINK
            ? followMouse
            : null
        }
        onClick={
          mode === MODE_ADD && coords.x && coords.y
            ? () => addElement(coords.x, coords.y)
            : mode === MODE_SELECT
            ? (event) => {
                if (!event.ctrlKey) {
                  select(null, event.ctrlKey);
                }
              }
            : mode === MODE_LINK
            ? () => {
                toggleLinkStep(uuid(), coords.x, coords.y);
              }
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
        <Components startDrag={startDrag} />
        <Links />
        {mode === MODE_ADD && components[selection[0]]({ ...coords })}
        {mode === MODE_DRAG && (
          <g
            style={{
              transform: `translate(${drag.x - drag.xOrigine}px, ${
                drag.y - drag.yOrigine
              }px)`,
            }}
          >
            {scene
              .filter((element) => selection.includes(element.id))
              .map((element) =>
                components[element.type]({
                  ...element,
                  selected: true,
                })
              )}
          </g>
        )}
        {mode === MODE_LINK && coords.x && coords.y && (
          <>
            <Link listOfPoints={currentLink} className="creationLink" />
            <path
              className="linkLastPath"
              d={`M ${currentLink[currentLink.length - 1].x} ${
                currentLink[currentLink.length - 1].y
              } L ${coords.x} ${coords.y}`}
            />
          </>
        )}
      </svg>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
