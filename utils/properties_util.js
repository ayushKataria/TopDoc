'use strict'
var propertiesReader = require('properties-reader');
var properties = propertiesReader('./app.properties');

const serverPort = properties.get("server.port")

const esServer = properties.get("es.server")
const esUserName = properties.get("es.username")
const esPassword = properties.get("es.password")

module.exports = {
    serverPort,
    esServer,
    esUserName,
    esPassword
}