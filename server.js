//At the top fo every server.js file
require("dotenv").config();

const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const MOVIES = require("./moviedex-api.json");

const app = express();

app.use(morgan("dev"));
//helmet must be before cors call
app.use(helmet());
app.use(cors());

app.use(function validateBearerToken(req, res, next) {
  console.log(process.env.API_TOKEN);
  const apiToken = process.env.API_TOKEN;
  const authToken = req.get("Authorization");

  if (!authToken || authToken.split(" ")[1] !== apiToken) {
    return res.status(401).json({ error: "Unauthorized Access" });
  }

  //Move to next middleware
  next();
});

app.get("/moviedex-api", function handleGetGenre(req, res) {
  let response = MOVIES.movies;

  if (req.query.genre) {
    response = response.filter((movies) => {
      movies.genre.toLowerCase().includes(req.query.genre.toLowerCase());
    });
  }

  if (req.query.country) {
    response = response.filter((movies) => {
      movies.country.toLowerCase().includes(req.query.country.toLowerCase());
    });
  }

  if (req.query.avg_vote) {
    response = response.filter((movies) => {
      Number(movies.avg_vote) >= Number(req.query.avg_vote);
    });
  }

  res.json(response);
});

const PORT = 8000;

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
