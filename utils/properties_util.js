"use strict";
var propertiesReader = require("properties-reader");
var properties = propertiesReader("./app.properties");

const serverPort = properties.get("server.port");

const esServer = properties.get("es.server");
const esUserName = properties.get("es.username");
const esPassword = properties.get("es.password");

const razor_pay_keyId = "rzp_test_yXDxVXIgFwuFyr";
const razor_pay_keyVal = "zVZM8Y6OINJ9L7awgJBBZqBj";

module.exports = {
  serverPort,
  esServer,
  esUserName,
  razor_pay_keyId,
  razor_pay_keyVal,
  esPassword,
};
