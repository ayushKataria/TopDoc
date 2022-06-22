'use strict'
var express = require('express')

var app = express()

app.use('/api', require('./routes/appointments/router'))
app.use('/api', require('./routes/search/router'))
app.use('/api', require('./routes/users/router'))

module.exports = app