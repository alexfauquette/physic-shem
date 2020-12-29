// this factor is used to get a good ratio between coordinates and line width
export const MULTIPLICATIVE_CONST = 100;

export const R_LEN = 1.4;

export const rotation = (angle, x0, y0, x, y) => {
  return `${
    x0 +
    Math.cos((-angle / 180) * Math.PI) * x -
    Math.sin((-angle / 180) * Math.PI) * y
  } ${
    y0 +
    Math.sin((-angle / 180) * Math.PI) * x +
    Math.cos((-angle / 180) * Math.PI) * y
  }`;
};

export const translateSVG2Canvas = {
  baseline: "bottom",
  hanging: "top",
  middle: "middle",
};
