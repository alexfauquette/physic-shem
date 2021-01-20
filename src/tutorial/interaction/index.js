import React from "react";

import styles from "./index.module.scss";

import svgComponents, { drawElement, isMultyPole } from "components";
import Anchor from "atoms/anchor";

import {
  getPoles,
  getCoord,
  getCoordId,
} from "redux/store/getCircuitikz/utils";

const DrawSvg = ({
  components,
  coordinates,
  width = 500,
  height = 400,
  drawGrid = true,
}) => {
  const Xpoints = drawGrid ? [...new Array(Math.floor(width / 100) + 1)] : [];
  const Ypoints = drawGrid ? [...new Array(Math.floor(height / 100) + 1)] : [];

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 ${-height} ${width} ${height}`}
      className={styles.drawingArea}
    >
      {/* draw the grid */}
      <>
        {Xpoints.map((_, xIndex) => (
          <path
            key={`x-${xIndex}`}
            d={`M ${xIndex * 100} 0 L ${xIndex * 100} ${-height}`}
            className={styles.grid}
          />
        ))}
        {Ypoints.map((_, yIndex) => (
          <path
            key={`y-${yIndex}`}
            d={`M 0 ${-yIndex * 100} L ${width} ${-yIndex * 100}`}
            className={styles.grid}
          />
        ))}
      </>

      {/* draw the elements */}
      {Object.keys(components).map((id) => {
        const { id: idComponent, ...componentProps } = components[id];

        return svgComponents[componentProps.type]({
          ...componentProps,
          fromCoords: { ...coordinates[componentProps.from] },
          toCoords: { ...coordinates[componentProps.to] },
          positionCoords: { ...coordinates[componentProps.position] },
          key: id,
        });
      })}
      {Object.keys(coordinates).map((id) => {
        const { id: idCoordinate, ...coordinateProps } = coordinates[id];
        return <Anchor key={id} {...coordinateProps} />;
      })}
    </svg>
  );
};

const ShowLatexCode = ({
  components,
  coordinates,
  useRelativeCoord = false,
}) => {
  const code = ["\\begin{circuitikz}"];

  let previousCoord = {};
  const coordinates_info = {};

  Object.keys(coordinates).forEach((id) => {
    const coord = coordinates[id];
    const coordId = getCoordId(coord);
    coordinates_info[coordId] = { ...coord };
  });

  Object.keys(components).forEach((id) => {
    const element = components[id];

    const line = ["\\draw"];
    if (element.from && element.to) {
      const { x: xFrom, y: yFrom } = coordinates[element.from];
      line.push(` ${getCoord(xFrom, yFrom, coordinates_info, previousCoord)}`);
      previousCoord = useRelativeCoord ? { x: xFrom, y: yFrom } : {};

      element.poles = getPoles(
        coordinates[element.from],
        coordinates[element.to]
      );

      line.push(` ${drawElement(element)}`);
      const { x: xTo, y: yTo } = coordinates[element.to];
      line.push(` ${getCoord(xTo, yTo, coordinates_info, previousCoord)}`);
      previousCoord = useRelativeCoord ? { x: xTo, y: yTo } : {};
    } else if (element.position && !isMultyPole[element.type]) {
      previousCoord = {};
      const { x, y } = coordinates[element.position];
      line.push(` ${getCoord(x, y, coordinates_info, {})}`);
      line.push(` ${drawElement(element)}`);
    } else if (element.position && isMultyPole[element.type]) {
      previousCoord = {};
      line.pop(); //the "\draw (x, y)" is added by the drawer function
      const { x, y, dx = 0, dy = 0 } = coordinates[element.position];

      line.push(
        ` ${drawElement(
          element,
          {
            x: x - dx,
            y: y - dy,
            position: false,
            anchor: element.anchor,
          },
          element.name || null
        )}`
      );
    }

    if (!isMultyPole[element.type]) {
      line.push(";");
    }

    code.push(line.join(""));
  });
  code.push("\\end{circuitikz}");

  return (
    <pre className={styles.latexArea}>
      {code.slice(0, code.length - 1).join("\n\t") +
        "\n" +
        code[code.length - 1]}
    </pre>
  );
};

const Displayer = ({
  components,
  coordinates,
  svgOption = {},
  latexOption = {},
}) => (
  <div className={styles.showArea}>
    <ShowLatexCode
      components={components}
      coordinates={coordinates}
      {...latexOption}
    />
    <DrawSvg components={components} coordinates={coordinates} {...svgOption} />
  </div>
);
export default Displayer;
