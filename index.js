"use strict";
var express = require("express");
var morgan = require("morgan");
var compression = require("compression");
//const bp = require('body-parser')
const fileUpload = require("express-fileupload");
// const esdb = require("./ESUtils/elasticSearch");
const cors = require("cors");

var app = express();
app.use(express.json());
app.use(morgan("tiny"));
app.use(compression());
app.use(
  cors({
    origin: "http://localhost:4200",
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// esdb.connectClient()
app.use(express.urlencoded({ extended: false }));
app.use("/api", require("./routes/appointments/router"));
app.use("/search", require("./routes/search/router"));
app.use("/user", require("./routes/users/router"));
app.use("/doctors", require("./routes/doctors/router"));
app.use("/doctorsAds", require("./routes/ads/router"));
app.use("/payments", require("./routes/payments/router"));

module.exports = app;
