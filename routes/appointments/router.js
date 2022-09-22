'use strict'
let router = require('express').Router()
let controller = require('./controller')

// Get the doctor id and fetch the information for thier schedule and booked slots
function getSchedule(req, res) {
    let doctorId = req.params.doctorId
    
    controller.getSchedule(doctorId)
        .then(data => res.send(data))
        .catch(err => res.status(err.statuscode).send(err))
}

// book a slot with a doctor
function bookAppointment(req, res) {
    let userId = req.header.userId
    let reqBody = req.body
    controller.bookAppointment(userId, reqBody)
        .then(data => res.send(data))
        .catch(err => res.status(err.statuscode).send(err))
}


router.get('/v1/appointment/schedule/:doctorId', getSchedule)

router.post('/v1/appointment/book/', bookAppointment)

module.exports = router