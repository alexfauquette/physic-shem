import React from "react";

import { Link as RouterLink } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
  card: {
    marginBottom: "1rem",
  },
  newSchemaText: {
    padding: "3rem",
    border: "2px solid gray",
    borderRadius: "1rem",
    fontSize: "1.5rem",
  },
  image: { height: "140px", backgroundSize: "contain" },
  cardTitle: { fontSize: "1.2rem", margin: "1rem 0 0.5rem 0" },
  cardInfo: {
    fontSize: "0.8rem",
    "& span": { fontStyle: "italic", color: "gray" },
  },
}));

const CircuitCard = ({ circuitname, username, date, id = null, ...props }) => {
  const classes = useStyles();

  return (
    <Card className={classes.card}>
      <CardActionArea component={RouterLink} to="/app" {...props}>
        <CardContent>
          {id === null ? (
            <p className={classes.newSchemaText}>+ NEW SCHEMA</p>
          ) : (
            <>
              {" "}
              <CardMedia
                image={`https://amathjourney.com/circuits/img/${id}.png`}
                title=""
                className={classes.image}
              />
              <h4 className={classes.cardTitle}>{circuitname}</h4>
              <p className={classes.cardInfo}>
                <span>by: </span>
                {username}
              </p>
              <p className={classes.cardInfo}>
                <span>the </span>
                {date.slice(0, 10).split("-").reverse().join("/")}
              </p>
            </>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CircuitCard;
