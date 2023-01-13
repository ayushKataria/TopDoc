"use strict";

// Akash
const { createLogger, format, transports } = require("winston");
var app = require("./index");

const bodyParser = require("body-parser"),
  fs = require("fs");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");
const customCss = fs.readFileSync(process.cwd() + "/swagger.css", "utf8");

const properties_util = require("./utils/properties_util");

app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, { customCss })
);

const port = properties_util.serverPort;

app.listen(port, function (error) {
  if (error) {
    console.log("Unable to listen for connections", error);
    process.exit(10);
  }
  console.log("express is listening on " + port);
});

(module.exports = createLogger), format, transports;
