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
