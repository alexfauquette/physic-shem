import React from "react";
import { connect } from "react-redux";
import { anchorMove, stopDragging } from "../redux/actions";
import { MODE_DRAG } from "../redux/store";
import Components from "./components";
import Anchors from "./anchors";

const mapDispatchToProps = (dispatch) => {
  return {
    anchorMove: (x, y, shiftPress) => dispatch(anchorMove(x, y, shiftPress)),
    stopDragging: () => dispatch(stopDragging()),
  };
};
const mapStateToProps = (state) => {
  return state;
};

const Container = ({ mode, stopDragging, anchorMove }) => {
  const followMouse = (event) => {
    switch (mode) {
      case MODE_DRAG:
        anchorMove(
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY,
          event.shiftKey
        );
        break;
      default:
        break;
    }
  };

  return (
    <>
      <p>{mode}</p>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 500 300"
        style={{ width: 500, height: 300 }}
        onMouseMove={mode === MODE_DRAG ? followMouse : null}
        // onClick={
        // mode === MODE_ADD && coords.x && coords.y
        //   ? () => addElement(coords.x, coords.y)
        //   : mode === MODE_SELECT
        //   ? (event) => {
        //       if (!event.ctrlKey) {
        //         select(null, event.ctrlKey);
        //       }
        //     }
        //   : mode === MODE_LINK
        //   ? () => {
        //       toggleLinkStep(uuid(), coords.x, coords.y);
        //     }
        //   : null
        // }
        onMouseUp={mode === MODE_DRAG ? () => stopDragging() : null}
      >
        <Components />
        <Anchors />

        {/* {mode === MODE_ADD && components[selection[0]]({ ...coords })}
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
        )} */}
      </svg>
    </>
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Container);
