var express = require("express");
var cors = require("cors");
var app = express();
var bodyParser = require("body-parser");
var users = require("./data/users");
var results = require("./data/results");

// create application/json parser
var jsonParser = bodyParser.json();
// allow cross-origin requests
app.use(cors());

// start server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});

// get a random user
app.get("/api/user", (req, res) => {
  res.json(users[Math.floor(Math.random() * users.length)]);
});

// get all results, caches data for 2 minutes
app.get("/api/results", (req, res) => {
  res.set("Cache-Control", "public, max-age=120");
  res.json(results);
});

// update results
app.post("/api/results", jsonParser, (req, res) => {
  const { winner, loser } = req.body;

  winnerIndex = results.findIndex((result) => result.name === winner);
  loserIndex = results.findIndex((result) => result.name === loser);

  winnerIndex === -1
    ? results.push({ name: winner, stats: { wins: 1, losses: 0 } })
    : results[winnerIndex].stats.wins++;
  loserIndex === -1
    ? results.push({ name: loser, stats: { wins: 0, losses: 1 } })
    : results[loserIndex].stats.losses++;
  res.json(results);
});
