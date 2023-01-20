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
  let days = req.body.days;
  if (days.length > 0) {
    for (let i = 0; i < days.length; i++) {
      if (
        days[i].hasOwnProperty("dayName") == false ||
        days[i].dayName == null ||
        days[i].dayName == ""
      ) {
        return res.status(400).send("bad request , day name cannot be empty");
      } else if (
        days[i].hasOwnProperty("date") == false ||
        days[i].date == null ||
        days[i].date == ""
      ) {
        return res.status(400).send("bad request , date cannot be empty");
      }
      if (days[i].sessions.length > 0) {
        for (let j = 0; j < days[i].sessions.length; j++) {
          if (
            days[i].sessions[j].hasOwnProperty("sessionId") == false ||
            days[i].sessions[j].sessionId == null ||
            days[i].sessions[j].sessionId == ""
          ) {
           return res.status(400).send("bad request , sessionId cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("startTime") == false ||
            days[i].sessions[j].startTime == null ||
            days[i].sessions[j].startTime == ""
          ) {
            return res.status(400).send("bad request , startTime cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("endTime") == false ||
            days[i].sessions[j].endTime == null ||
            days[i].sessions[j].endTime == ""
          ) {
           return res.status(400).send("bad request , endTime cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("clinic") == false ||
            days[i].sessions[j].clinic == null ||
            days[i].sessions[j].clinic == ""
          ) {
           return res.status(400).send("bad request , clinic cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("sessionSlots") == false
          ) {
           return res
              .status(400)
              .send("bad request , sessionSlots field is mandatory");
          } else if (
            days[i].sessions[j].hasOwnProperty("prioritySlots") == false
          ) {
           return res
              .status(400)
              .send("bad request , prioritySlots field is mandatory");
          }
        }
      }
    }
  }
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
    days == null ||
    days == ""
  ) {
    res.status(400).send("bad request , days cannot be empty");
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
