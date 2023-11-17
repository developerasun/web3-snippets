const express = require("express");
const app = express();

app.get("/", function (req, res) {
  res.json({
    message: "check env with no env file",
    value: `FOO: ${process.env.FOO}`,
    secret: process.env.SUPER_SECRET,
  });
});

app.listen(9000);
console.log("listening on 9000");
