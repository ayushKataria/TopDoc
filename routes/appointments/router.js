"use strict";
let router = require("express").Router();
let controller = require("./controller");
const appointmentAttributeList = require("./constants/appointmentAttributeList");
const _ = require("underscore");

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
  let userId = req.header("userId");
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
  }
  // else if (
  //   req.body.days[0].hasOwnProperty("dayName") == false ||
  //   req.body.days[0].dayName == null ||
  //   req.body.days[0].dayName == ""
  // ) {
  //   res.status(400).send("bad request , day name cannot be empty");
  // } else if (
  //   req.body.days[0].hasOwnProperty("date") == false ||
  //   req.body.days[0].date == null ||
  //   req.body.days[0].date == ""
  // ) {
  //   res.status(400).send("bad request , date cannot be empty");
  // }
  // else if (
  //   req.body.days[0].hasOwnProperty("sessions") == false ||
  //   req.body.days[0].sessions == null ||
  //   req.body.days[0].sessions == ""
  // ) {
  //   res.status(400).send("bad request , sessions cannot be empty");
  // }
  // else if (
  //   req.body.days[0].sessions[0].hasOwnProperty("sessionId") == false ||
  //   req.body.days[0].sessions[0].sessionId == null ||
  //   req.body.days[0].sessions[0].sessionId == ""
  // ) {
  //   res.status(400).send("bad request , sessionId cannot be empty");
  // } else if (
  //   req.body.days[0].sessions[0].hasOwnProperty("starttime") == false ||
  //   req.body.days[0].sessions[0].starttime == null ||
  //   req.body.days[0].sessions[0].starttime == ""
  // ) {
  //   res.status(400).send("bad request , starttime cannot be empty");
  // } else if (
  //   req.body.days[0].sessions[0].hasOwnProperty("endtime") == false ||
  //   req.body.days[0].sessions[0].endtime == null ||
  //   req.body.days[0].sessions[0].endtime == ""
  // ) {
  //   res.status(400).send("bad request , endtime cannot be empty");
  // } else if (
  //   req.body.days[0].sessions[0].hasOwnProperty("clinic") == false ||
  //   req.body.days[0].sessions[0].clinic == null ||
  //   req.body.days[0].sessions[0].clinic == ""
  // ) {
  //   res.status(400).send("bad request , clinic cannot be empty");
  // }
  else {
    // console.log("error", err);
    controller
      .createSessions(req.body)
      .then((data) => res.send(data))
      .catch((err) => res.status(err.statuscode).send(err));
  }
}

// book a slot with a doctor
async function bookingAppointment(req, res) {
  try {
    if (req.body.hasOwnProperty("userType") == true) {
      if (req.body.userType == "registered") {
        let fail = false;
        const list = appointmentAttributeList.bookingAttributes;
        Object.keys(req.body).forEach((key) => {
          if (!list.includes(key)) {
            res
              .status(400)
              .send("bad request , unknown attribute found in request");
            fail = true;
          }
        });
        if (fail) return;

        if (
          req.body.hasOwnProperty("clinicDetails") == false ||
          req.body.clinicDetails == null ||
          req.body.clinicDetails == "" ||
          _.isEmpty(req.body.clinicDetails) == true
        ) {
          res.status(400).send("bad request , clinicDetails cannot be empty");
        } else if (
          req.body.hasOwnProperty("clinicId") == false ||
          req.body.clinicId == null ||
          req.body.clinicId == ""
        ) {
          res.status(400).send("bad request , clinicId cannot be empty");
        } else if (
          req.body.hasOwnProperty("userType") == false ||
          req.body.userType == null ||
          req.body.userType == ""
        ) {
          res.status(400).send("bad request , userType cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionId") == false ||
          req.body.sessionId == null ||
          req.body.sessionId == ""
        ) {
          res.status(400).send("bad request , sessionId cannot be empty");
        } else if (
          req.body.hasOwnProperty("doctorId") == false ||
          req.body.doctorId == null ||
          req.body.doctorId == ""
        ) {
          res.status(400).send("bad request , doctorId cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotId") == false ||
          req.body.slotId == null ||
          req.body.slotId == ""
        ) {
          res.status(400).send("bad request , slotId cannot be empty");
        } else if (
          req.body.hasOwnProperty("reasonForVisit") == false ||
          req.body.reasonForVisit == null ||
          req.body.reasonForVisit == ""
        ) {
          res.status(400).send("bad request , reasonForVisit cannot be empty");
        } else if (
          req.body.hasOwnProperty("appointmentType") == false ||
          req.body.appointmentType == null ||
          req.body.appointmentType == ""
        ) {
          res.status(400).send("bad request , appointmentType cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotDay") == false ||
          req.body.slotDay == null ||
          req.body.slotDay == ""
        ) {
          res.status(400).send("bad request , slotDay cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotTime") == false ||
          req.body.slotTime == null ||
          req.body.slotTime == ""
        ) {
          res.status(400).send("bad request , slotTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("userId") == false ||
          req.body.userId == null ||
          req.body.userId == ""
        ) {
          res.status(400).send("bad request , userId cannot be empty");
        } else if (
          req.body.hasOwnProperty("bookingTimeStamp") == false ||
          req.body.bookingTimeStamp == null ||
          req.body.bookingTimeStamp == ""
        ) {
          res
            .status(400)
            .send("bad request , bookingTimeStamp cannot be empty");
        } else if (
          req.body.hasOwnProperty("appointmentDate") == false ||
          req.body.appointmentDate == null ||
          req.body.appointmentDate == ""
        ) {
          res.status(400).send("bad request , appointmentDate cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionStartTime") == false ||
          req.body.sessionStartTime == null ||
          req.body.sessionStartTime == ""
        ) {
          res
            .status(400)
            .send("bad request , sessionStartTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionEndTime") == false ||
          req.body.sessionEndTime == null ||
          req.body.sessionEndTime == ""
        ) {
          res.status(400).send("bad request , sessionEndTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotType") == false ||
          req.body.slotType == null ||
          req.body.slotType == ""
        ) {
          res.status(400).send("bad request , slotType cannot be empty");
        } else {
          console.log("in router");
          await controller
            .bookingAppointment(req.body)
            .then((data) => res.send(data))
            .catch((err) => res.status(err.statuscode).send(err));
        }
      } else if (req.body.userType == "unRegistered") {
        let fail = false;
        const list = appointmentAttributeList.unRegBookingAttributes;
        Object.keys(req.body).forEach((key) => {
          if (!list.includes(key)) {
            res
              .status(400)
              .send("bad request , unknown attribute found in request");
            fail = true;
          }
        });
        if (fail) return;

        if (
          req.body.hasOwnProperty("clinicDetails") == false ||
          req.body.clinicDetails == null ||
          req.body.clinicDetails == "" ||
          _.isEmpty(req.body.clinicDetails) == true
        ) {
          res.status(400).send("bad request , clinicDetails cannot be empty");
        } else if (
          req.body.hasOwnProperty("clinicId") == false ||
          req.body.clinicId == null ||
          req.body.clinicId == ""
        ) {
          res.status(400).send("bad request , clinicId cannot be empty");
        } else if (
          req.body.hasOwnProperty("userType") == false ||
          req.body.userType == null ||
          req.body.userType == ""
        ) {
          res.status(400).send("bad request , userType cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionId") == false ||
          req.body.sessionId == null ||
          req.body.sessionId == ""
        ) {
          res.status(400).send("bad request , sessionId cannot be empty");
        } else if (
          req.body.hasOwnProperty("doctorId") == false ||
          req.body.doctorId == null ||
          req.body.doctorId == ""
        ) {
          res.status(400).send("bad request , doctorId cannot be empty");
        } else if (req.body.hasOwnProperty("reasonForVisit") == false) {
          res.status(400).send("bad request , reasonForVisit is mandatory");
        } else if (
          req.body.hasOwnProperty("appointmentType") == false ||
          req.body.appointmentType == null ||
          req.body.appointmentType == ""
        ) {
          res.status(400).send("bad request , appointmentType cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotDay") == false ||
          req.body.slotDay == null ||
          req.body.slotDay == ""
        ) {
          res.status(400).send("bad request , slotDay cannot be empty");
        } else if (
          req.body.hasOwnProperty("bookingTimeStamp") == false ||
          req.body.bookingTimeStamp == null ||
          req.body.bookingTimeStamp == ""
        ) {
          res
            .status(400)
            .send("bad request , bookingTimeStamp cannot be empty");
        } else if (
          req.body.hasOwnProperty("appointmentDate") == false ||
          req.body.appointmentDate == null ||
          req.body.appointmentDate == ""
        ) {
          res.status(400).send("bad request , appointmentDate cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionStartTime") == false ||
          req.body.sessionStartTime == null ||
          req.body.sessionStartTime == ""
        ) {
          res
            .status(400)
            .send("bad request , sessionStartTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionEndTime") == false ||
          req.body.sessionEndTime == null ||
          req.body.sessionEndTime == ""
        ) {
          res.status(400).send("bad request , sessionEndTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("duration") == false ||
          req.body.duration == null ||
          req.body.duration == ""
        ) {
          res.status(400).send("bad request , duration cannot be empty");
        } else if (
          req.body.hasOwnProperty("mobile") == false ||
          req.body.mobile == null ||
          req.body.mobile == ""
        ) {
          res.status(400).send("bad request , mobile cannot be empty");
        } else if (
          req.body.hasOwnProperty("userName") == false ||
          req.body.userName == null ||
          req.body.userName == ""
        ) {
          res.status(400).send("bad request , userName cannot be empty");
        } else if (
          req.body.hasOwnProperty("slotType") == false ||
          req.body.slotType == null ||
          req.body.slotType == ""
        ) {
          res.status(400).send("bad request , slotType cannot be empty");
        } else {
          console.log("in router");
          await controller
            .bookingAppointment(req.body)
            .then((data) => res.send(data))
            .catch((err) => res.status(err.statuscode).send(err));
        }
      } else {
        res.status(400).send("bad request , unknown userType");
      }
    } else {
      res.status(400).send("bad request , userType is mandatory");
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

async function searchInBooking(req, res) {
  try {
    let fail = false;
    let list = appointmentAttributeList.searchInBooking;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        res
          .status(400)
          .send("bad request , unknown attribute found in request");
        fail = true;
      }
    });
    if (fail) return;

    if (req.body.hasOwnProperty("search") == true) {
      list = appointmentAttributeList.searchAttributes;
      Object.keys(req.body.search).forEach((key) => {
        if (!list.includes(key)) {
          res
            .status(400)
            .send("bad request , unknown attribute found in search");
          fail = true;
        }
      });
    }
    if (fail) return;

    // let filtersAttributes = req.body.filters.map((e) => {
    //   return Object.keys(e)[0];
    // });
    // console.log(filtersAttributes);
    if (req.body.hasOwnProperty("filters") == true) {
      list = appointmentAttributeList.filterAttributes;
      req.body.filters
        .map((e) => {
          return Object.keys(e)[0];
        })
        .forEach((key) => {
          if (!list.includes(key)) {
            res
              .status(400)
              .send("bad request , unknown attribute found in filter");
            fail = true;
          }
        });
    }
    if (fail) return;

    if (req.body.hasOwnProperty("sort") == true) {
      list = appointmentAttributeList.sortAttributes;
      req.body.sort
        .map((e) => {
          return Object.keys(e)[0];
        })
        .forEach((key) => {
          if (!list.includes(key)) {
            res
              .status(400)
              .send("bad request , unknown attribute found in sort");
            fail = true;
          }
        });
    }
    if (fail) return;

    if (
      req.body.hasOwnProperty("pageSize") == false ||
      req.body.pageSize == null ||
      req.body.pageSize == ""
    ) {
      res.status(400).send("bad request , pageSize cannot be empty");
    } else if (
      req.body.hasOwnProperty("pageNo") == false ||
      req.body.pageNo == null
    ) {
      res.status(400).send("bad request , pageNo cannot be empty");
    } else if (req.body.hasOwnProperty("search") == false) {
      res.status(400).send("bad request , search is mandatory");
    } else if (req.body.hasOwnProperty("sort") == false) {
      res.status(400).send("bad request , sort is mandatory");
    } else if (req.body.hasOwnProperty("filters") == false) {
      res.status(400).send("bad request , filters is mandatory");
    } else {
      console.log("in router");
      await controller
        .searchInBooking(req.body)
        .then((data) => res.send(data))
        .catch((err) => res.status(err.statuscode).send(err));
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

router.get("/v1/appointment/schedule/:doctorId", getSchedule);

router.post("/v1/appointment/book/", bookAppointment);
router.post("/v1/appointment/booking/", bookingAppointment);
router.post("/v1/appointment/search/", searchInBooking);
router.post("/v1/appointment/create/", createSessions);

module.exports = router;
