const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express();

app.get("/", async function (req, res) {
  const isContainer = (await import("is-docker")).default();

  res.json({
    isDocker: isContainer,
    value: `FOO: ${process.env.FOO}`,
    fromSecret: process.env.SUPER_SECRET ?? "not in a swarm",
    fromCompose: process.env.MESSAGE ?? "no value",
  });
});

app.listen(9000);
console.log("listening on 9000");
