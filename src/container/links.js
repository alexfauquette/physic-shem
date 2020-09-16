import React from "react";
import { connect } from "react-redux";
import "./linkStyle.scss";

const mapStateToProps = ({ links }) => {
  return { links };
};

export const Link = ({ listOfPoints, className }) => (
  <g className={`${className || "link"}`}>
    <path d={`M ${listOfPoints.map(({ x, y }) => `${x} ${y}`).join("L")}`} />
    {listOfPoints.map(({ id, x, y }) => (
      <circle key={id} cx={x} cy={y} r={5} />
    ))}
  </g>
);

const Links = ({ links }) => (
  <>
    {links.map(({ id, listOfPoints }) => (
      <Link key={id} listOfPoints={listOfPoints} />
    ))}
  </>
);

export default connect(mapStateToProps)(Links);
