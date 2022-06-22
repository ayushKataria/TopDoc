'use strict'
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./app.properties');

const serverPort = properties.get("server.port")

module.exports = {
    serverPort
}