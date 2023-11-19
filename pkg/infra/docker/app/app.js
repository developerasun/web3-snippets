const express = require("express");

const app = express();

app.get("/", async function (req, res) {
  const isContainer = (await import("is-docker")).default();

  res.json({
    message: "check env with no env file",
    value: `FOO: ${process.env.FOO}`,
    secret: process.env.SUPER_SECRET ?? "not detected",
    encryptedMessage: process.env.MESSAGE ?? "no value",
    isDocker: isContainer,
  });
});

app.listen(9000);
console.log("listening on 9000");
