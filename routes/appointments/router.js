"use strict";
let router = require("express").Router();
let controller = require("./controller");

// Get the doctor id and fetch the information for thier schedule and booked slots
function getSchedule(req, res) {
  let doctorId = req.params.doctorId;

  controller
    .getSchedule(doctorId)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
}

// book a slot with a doctor
function bookAppointment(req, res) {
  let userId = req.header.userId;
  let reqBody = req.body;
  controller
    .bookAppointment(userId, reqBody)
    .then((data) => res.send(data))
    .catch((err) => res.status(err.statuscode).send(err));
}

async function createSessions(req, res) {
  console.log("printAkash");
  if (
    req.body.hasOwnProperty("doctorId") == false ||
    req.body.doctorId == null ||
    req.body.doctorId == ""
  ) {
    res.status(400).send("bad request , id cannot be empty");
  } else if (
    req.body.hasOwnProperty("duration") == false ||
    req.body.duration == null ||
    req.body.duration == ""
  ) {
    res.status(400).send("bad request , duration cannot be empty");
  } else if (
    req.body.hasOwnProperty("days") == false ||
    req.body.days == null ||
    req.body.days == ""
  ) {
    res.status(400).send("bad request , days cannot be empty");
  } else if (
    req.body.days[0].hasOwnProperty("dayName") == false ||
    req.body.days[0].dayName == null ||
    req.body.days[0].dayName == ""
  ) {
    res.status(400).send("bad request , day name cannot be empty");
  } else if (
    req.body.days[0].hasOwnProperty("date") == false ||
    req.body.days[0].date == null ||
    req.body.days[0].date == ""
  ) {
    res.status(400).send("bad request , date cannot be empty");
  } else if (
    req.body.days[0].hasOwnProperty("sessions") == false ||
    req.body.days[0].sessions == null ||
    req.body.days[0].sessions == ""
  ) {
    res.status(400).send("bad request , sessions cannot be empty");
  } else if (
    req.body.days[0].sessions[0].hasOwnProperty("sessionId") == false ||
    req.body.days[0].sessions[0].sessionId == null ||
    req.body.days[0].sessions[0].sessionId == ""
  ) {
    res.status(400).send("bad request , sessionId cannot be empty");
  } else if (
    req.body.days[0].sessions[0].hasOwnProperty("starttime") == false ||
    req.body.days[0].sessions[0].starttime == null ||
    req.body.days[0].sessions[0].starttime == ""
  ) {
    res.status(400).send("bad request , starttime cannot be empty");
  } else if (
    req.body.days[0].sessions[0].hasOwnProperty("endtime") == false ||
    req.body.days[0].sessions[0].endtime == null ||
    req.body.days[0].sessions[0].endtime == ""
  ) {
    res.status(400).send("bad request , endtime cannot be empty");
  } else if (
    req.body.days[0].sessions[0].hasOwnProperty("clinic") == false ||
    req.body.days[0].sessions[0].clinic == null ||
    req.body.days[0].sessions[0].clinic == ""
  ) {
    res.status(400).send("bad request , clinic cannot be empty");
  } else {
    // console.log("error", err);
    controller
      .createSessions(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
}

router.get("/v1/appointment/schedule/:doctorId", getSchedule);

router.post("/v1/appointment/book/", bookAppointment);
router.post("/v1/appointment/create/", createSessions);

module.exports = router;
