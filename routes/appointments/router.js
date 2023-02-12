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
            days[i].sessions[j].sessionId == null
          ) {
            return res
              .status(400)
              .send("bad request , sessionId cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("startTime") == false ||
            days[i].sessions[j].startTime == null
          ) {
            return res
              .status(400)
              .send("bad request , startTime cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("endTime") == false ||
            days[i].sessions[j].endTime == null
          ) {
            return res
              .status(400)
              .send("bad request , endTime cannot be empty");
          } else if (
            days[i].sessions[j].hasOwnProperty("clinic") == false ||
            days[i].sessions[j].clinic == null
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

// book a slot with a doctor
async function bookingAppointment(req, res) {
  try {
    if (req.body.hasOwnProperty("userType") == true) {
      if (req.body.userType == "registered") {
        let fail = false;
        const list = appointmentAttributeList.bookingAttributes;
        Object.keys(req.body).forEach((key) => {
          if (!list.includes(key)) {
            fail = true;
          }
        });
        if (fail) {
          return res
            .status(400)
            .send("bad request , unknown attribute found in request");
        }

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
          req.body.hasOwnProperty("mobile") == false ||
          req.body.mobile == null ||
          req.body.mobile == ""
        ) {
          res.status(400).send("bad request , mobile cannot be empty");
        } else if (req.body.hasOwnProperty("email") == false) {
          res.status(400).send("bad request , email cannot be empty");
        } else if (
          req.body.hasOwnProperty("paymentStatus") == false ||
          req.body.paymentStatus == null ||
          req.body.paymentStatus == ""
        ) {
          return res
            .status(400)
            .send("bad request , paymentStatus name cannot be empty");
        } else if (
          req.body.hasOwnProperty("sessionId") == false ||
          req.body.sessionId == null ||
          req.body.sessionId == ""
        ) {
          res.status(400).send("bad request , sessionId cannot be empty");
        } else if (
          req.body.hasOwnProperty("userName") == false ||
          req.body.userName == null ||
          req.body.userName == ""
        ) {
          res.status(400).send("bad request , userName cannot be empty");
        } else if (
          req.body.hasOwnProperty("gender") == false ||
          req.body.gender == null ||
          req.body.gender == ""
        ) {
          res.status(400).send("bad request , gender cannot be empty");
        } else if (
          req.body.hasOwnProperty("dob") == false ||
          req.body.dob == null ||
          req.body.dob == ""
        ) {
          res.status(400).send("bad request , dob cannot be empty");
        } else if (
          req.body.hasOwnProperty("pin") == false ||
          req.body.pin == null ||
          req.body.pin == ""
        ) {
          res.status(400).send("bad request , pin cannot be empty");
        } else if (
          req.body.hasOwnProperty("endTime") == false ||
          req.body.endTime == null ||
          req.body.endTime == ""
        ) {
          res.status(400).send("bad request , endTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("predictedSlotTime") == false ||
          req.body.predictedSlotTime == null ||
          req.body.predictedSlotTime == ""
        ) {
          res
            .status(400)
            .send("bad request , predictedSlotTime cannot be empty");
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
        console.log("Unregistered triggering");
        let fail = false;
        const list = appointmentAttributeList.unRegBookingAttributes;
        Object.keys(req.body).forEach((key) => {
          if (!list.includes(key)) {
            fail = true;
          }
        });
        if (fail) {
          return res
            .status(400)
            .send("bad request , unknown attribute found in request");
        }

        console.log("Return triggering unreg");
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
          req.body.hasOwnProperty("paymentStatus") == false ||
          req.body.paymentStatus == null ||
          req.body.paymentStatus == ""
        ) {
          return res
            .status(400)
            .send("bad request , paymentStatus name cannot be empty");
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
          req.body.hasOwnProperty("gender") == false ||
          req.body.gender == null ||
          req.body.gender == ""
        ) {
          res.status(400).send("bad request , gender cannot be empty");
        } else if (
          req.body.hasOwnProperty("dob") == false ||
          req.body.dob == null ||
          req.body.dob == ""
        ) {
          res.status(400).send("bad request , dob cannot be empty");
        } else if (
          req.body.hasOwnProperty("pin") == false ||
          req.body.pin == null ||
          req.body.pin == ""
        ) {
          res.status(400).send("bad request , pin cannot be empty");
        } else if (req.body.hasOwnProperty("email") == false) {
          res.status(400).send("bad request , email cannot be empty");
        } else if (
          req.body.hasOwnProperty("endTime") == false ||
          req.body.endTime == null ||
          req.body.endTime == ""
        ) {
          res.status(400).send("bad request , endTime cannot be empty");
        } else if (
          req.body.hasOwnProperty("predictedSlotTime") == false ||
          req.body.predictedSlotTime == null ||
          req.body.predictedSlotTime == ""
        ) {
          res
            .status(400)
            .send("bad request , predictedSlotTime cannot be empty");
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
        fail = true;
      }
    });
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in request");
    }

    if (req.body.hasOwnProperty("search") == true) {
      list = appointmentAttributeList.searchAttributes;
      Object.keys(req.body.search).forEach((key) => {
        if (!list.includes(key)) {
          fail = true;
        }
      });
    }
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in search");
    }

    if (req.body.hasOwnProperty("filters") == true) {
      list = appointmentAttributeList.filterAttributes;
      req.body.filters
        .map((e) => {
          return Object.keys(e)[0];
        })
        .forEach((key) => {
          if (!list.includes(key)) {
            fail = true;
          }
        });
    }
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in filter");
    }

    if (req.body.hasOwnProperty("sort") == true) {
      list = appointmentAttributeList.sortAttributes;
      req.body.sort
        .map((e) => {
          return Object.keys(e)[0];
        })
        .forEach((key) => {
          if (!list.includes(key)) {
            fail = true;
          }
        });
    }
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in sort");
    }

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

async function delaySessionByDuration(req, res) {
  try {
    let fail = false;
    const list = appointmentAttributeList.sessionDelayAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        fail = true;
      }
    });
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in request");
    }

    if (
      req.body.hasOwnProperty("message") == false ||
      req.body.message == null
    ) {
      res.status(400).send("bad request , message is mandatory");
    } else if (
      req.body.hasOwnProperty("doctorId") == false ||
      req.body.doctorId == null ||
      req.body.doctorId == ""
    ) {
      res.status(400).send("bad request , doctorId cannot be empty");
    } else if (
      req.body.hasOwnProperty("sessionId") == false ||
      req.body.sessionId == null ||
      req.body.sessionId == ""
    ) {
      res.status(400).send("bad request , sessionId cannot be empty");
    } else if (
      req.body.hasOwnProperty("sessionDelayDuration") == false ||
      req.body.sessionDelayDuration == null ||
      req.body.sessionDelayDuration == ""
    ) {
      res
        .status(400)
        .send("bad request , sessionDelayDuration cannot be empty");
    } else {
      await controller
        .delaySessionByDuration(req.body)
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

async function queueManagement(req, res) {
  try {
    let fail = false;
    const list = appointmentAttributeList.queueAttributes;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        fail = true;
      }
    });
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in request");
    }

    if (
      req.body.hasOwnProperty("sessionId") == false ||
      req.body.sessionId == null ||
      req.body.sessionId == ""
    ) {
      res.status(400).send("bad request , sessionId cannot be empty");
    } else if (req.body.hasOwnProperty("lastEndedTime") == false) {
      res.status(400).send("bad request , lastEndedTime is mandatory");
    } else {
      await controller
        .queueManagement(req.body)
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
async function cancelDoctorSession(req, res) {
  try {
    let fail = false;
    const list = appointmentAttributeList.cancelDoctorSession;
    Object.keys(req.body).forEach((key) => {
      if (!list.includes(key)) {
        fail = true;
      }
    });
    if (fail) {
      return res
        .status(400)
        .send("bad request , unknown attribute found in request");
    }

    if (
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
      req.body.hasOwnProperty("status") == false ||
      req.body.status == null ||
      req.body.status == ""
    ) {
      res.status(400).send("bad request , status cannot be empty");
    } else {
      await controller
        .cancelDoctorSession(req.body)
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
router.post("/v1/appointment/sessiondelay/", delaySessionByDuration);
router.post("/v1/appointment/queue/", queueManagement);
router.post("/v1/appointment/cancel/", cancelDoctorSession);

module.exports = router;
