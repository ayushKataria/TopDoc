'use strict'
var router = require('express').Router()

function test(req, res) {
    res.send("APP SUCCESS")
}


router.get('/users', test)

module.exports = router