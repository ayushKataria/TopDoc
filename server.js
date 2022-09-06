'use strict'
var app = require('./index')
const properties_util = require('./utils/properties_util')

const port = properties_util.serverPort;

app.listen(port, function (error) {
  if (error) {
    console.log('Unable to listen for connections', error)
    process.exit(10)
  }
  console.log('express is listening on ' + port)
})