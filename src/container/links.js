import React from "react";
import { connect } from "react-redux";

const mapStateToProps = ({ links }) => {
  return { links };
};

const Links = ({ links }) => {
  console.log(links);
  return (
    <>
      {links.map(({ id, listOfPoints }) => (
        <path
          key={id}
          d={`M ${listOfPoints.map(({ x, y }) => `${x} ${y}`).join("L")}`}
          style={{ strokeWidth: 2, stroke: "black" }}
        />
      ))}
    </>
  );
};

export default connect(mapStateToProps)(Links);
