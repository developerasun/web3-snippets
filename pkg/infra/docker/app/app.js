const express = require("express");
const app = express();

app.get("/", async function (req, res) {
  res.json({
    message: "check env with no env file",
    value: `FOO: ${process.env.FOO}`,
    secret: process.env.SUPER_SECRET ?? "not detected",
    check: process.env.MESSAGE ?? "no value",
  });
});

app.listen(9000);
console.log("listening on 9000");
