'use strict'
var express = require('express')
//const bp = require('body-parser')
const fileUpload =require('express-fileupload')

var app = express()
app.use(express.json());

app.use(fileUpload({
    useTempFiles : true
}))

app.use(express.urlencoded({ extended: false}))
app.use('/api', require('./routes/appointments/router'))
app.use('/search', require('./routes/search/router'))
app.use('/user', require('./routes/users/router'))
app.use('/doctors',require('./routes/doctors/router'))

module.exports = app