export const rotation = (angle, x0, y0, x, y, xScale = 1, yScale = 1) => {
  return `${
    x0 +
    Math.cos((-angle / 180) * Math.PI) * xScale * x -
    Math.sin((-angle / 180) * Math.PI) * yScale * y
  } ${
    y0 +
    Math.sin((-angle / 180) * Math.PI) * xScale * x +
    Math.cos((-angle / 180) * Math.PI) * yScale * y
  }`;
};

export const point_included = ({ x0, y0, x1, y1 }, { x, y }) => {
  const maxX = Math.max(x0, x1);
  const minX = Math.min(x0, x1);

  const maxY = Math.max(y0, y1);
  const minY = Math.min(y0, y1);

  if (x < minX || x > maxX) {
    return false;
  }
  if (y < minY || y > maxY) {
    return false;
  }
  return true;
};

export const rect_included = (
  { x0, y0, x1, y1 },
  { x, y, angle, dx1, dx2, dy1, dy2 }
) => {
  const maxX = Math.max(x0, x1);
  const minX = Math.min(x0, x1);

  const maxY = Math.max(y0, y1);
  const minY = Math.min(y0, y1);

  const xa =
    x +
    Math.cos((-angle / 180) * Math.PI) * dx1 -
    Math.sin((-angle / 180) * Math.PI) * dy1;
  if (xa < minX || xa > maxX) {
    return false;
  }

  const ya =
    y +
    Math.sin((-angle / 180) * Math.PI) * dx1 +
    Math.cos((-angle / 180) * Math.PI) * dy1;
  if (ya < minY || ya > maxY) {
    return false;
  }

  const xb =
    x +
    Math.cos((-angle / 180) * Math.PI) * dx2 -
    Math.sin((-angle / 180) * Math.PI) * dy1;
  if (xb < minX || xb > maxX) {
    return false;
  }

  const yb =
    y +
    Math.sin((-angle / 180) * Math.PI) * dx2 +
    Math.cos((-angle / 180) * Math.PI) * dy1;
  if (yb < minY || yb > maxY) {
    return false;
  }

  const xc =
    x +
    Math.cos((-angle / 180) * Math.PI) * dx1 -
    Math.sin((-angle / 180) * Math.PI) * dy2;
  if (xc < minX || xc > maxX) {
    return false;
  }

  const yc =
    y +
    Math.sin((-angle / 180) * Math.PI) * dx1 +
    Math.cos((-angle / 180) * Math.PI) * dy2;
  if (yc < minY || yc > maxY) {
    return false;
  }

  const xd =
    x +
    Math.cos((-angle / 180) * Math.PI) * dx2 -
    Math.sin((-angle / 180) * Math.PI) * dy2;
  if (xd < minX || xd > maxX) {
    return false;
  }

  const yd =
    y +
    Math.sin((-angle / 180) * Math.PI) * dx2 +
    Math.cos((-angle / 180) * Math.PI) * dy2;
  if (yd < minY || yd > maxY) {
    return false;
  }

  return true;
};
