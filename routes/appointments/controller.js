"use strict";
const esUtil = require("../../utils/es_util");
const uuid = require("uuid");
const docController = require("../doctors/controller");
const searchController = require("../search/controller");
const aggsFunc = require("../search/searchAggrigation");

async function bookAppointment(patientId, reqBody) {
  try {
    if (!reqBody.hasOwnProperty("doctorId")) {
      throw { statuscode: 400, message: "doctorId is mandatory" };
    } else if (!reqBody.hasOwnProperty("address")) {
      throw { statuscode: 400, message: "address is mandatory" };
    } else if (!reqBody.hasOwnProperty("location")) {
      throw { statuscode: 400, message: "location is mandatory" };
    } else if (!reqBody.hasOwnProperty("reasonForVisit")) {
      throw { statuscode: 400, message: "reasonForVisit is mandatory" };
    } else if (!reqBody.hasOwnProperty("type")) {
      throw { statuscode: 400, message: "type is mandatory" };
    } else if (!reqBody.hasOwnProperty("slotTime")) {
      throw { statuscode: 400, message: "slotTime is mandatory" };
    } else if (!reqBody.hasOwnProperty("slotDay")) {
      throw { statuscode: 400, message: "slotDay is mandatory" };
    } else if (!reqBody.hasOwnProperty("appointmentTime")) {
      throw { statuscode: 400, message: "appointmentTime is mandatory" };
    }
    reqBody["patientId"] = patientId;
    reqBody["appointmentId"] = uuid.v4();
    reqBody["status"] = "Booked";
    reqBody["appointmentNumber"] = await getAppointmentNumber(
      reqBody["doctorId"],
      reqBody["slotTime"],
      reqBody["slotDay"]
    );
    await esUtil.insert(reqBody, reqBody["appointmentId"], "schedule");
    return reqBody;
  } catch (err) {
    console.log(err.stack);
    if (err.hasOwnProperty("statuscode")) {
      throw err;
    } else {
      throw {
        statuscode: 500,
        message: "Unexpected error occured",
        err: err.message,
      };
    }
  }
}

async function getSchedule(doctorId) {
  try {
    let res = await esUtil.getById("doctor", doctorId);
    // console.log(res)
    // Fetch the schedule meta from ES for doctorId from doctor index
    // Fetch booked appointments for the doctor from schedule index
    // Form all possible slots for each day
    // mark booked slots as isBooked True
    // send response
    // Possible response strucutre
    // {
    //     "slotTime": 30
    //     "Monday": {0800:{"isBooked": true/false},0830,0900,0930,1500,1530,1600,
    //     "Tuesday": /...
    //     ...
    // }
    let slots = {};
    for (const [key, value] of Object.entries(res["_source"]["schedule"])) {
      slots[key] = {
        session1_slots: [],
        session2_slots: [],
      };
      if (value["session1_start_time"] && value["session1_start_time"] != "") {
        slots[key]["session1_slots"] = createHalfHourIntervals(
          value["session1_start_time"],
          value["session1_end_time"]
        ).map(formatDateHHcolonMM);
      }
      if (value["session2_start_time"] && value["session2_start_time"] != "") {
        slots[key]["session2_slots"] = createHalfHourIntervals(
          value["session2_start_time"],
          value["session2_end_time"]
        ).map(formatDateHHcolonMM);
      }
    }
    return {
      totalSlots: slots,
    };
  } catch (err) {
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
      err: err.message,
    };
  }
}

async function getAppointmentNumber(doctorId, slotTime, slotDay) {
  let query = {
    size: 1,
    _source: ["appointmentNumber"],
    sort: {
      appointmentNumber: "desc",
    },
    query: {
      bool: {
        filter: [
          {
            term: {
              doctorId: doctorId,
            },
          },
          {
            term: {
              slotTime: slotTime,
            },
          },
          {
            term: {
              slotDay: slotDay,
            },
          },
        ],
      },
    },
  };
  let res = await esUtil.search(query, "schedule");
  if (res["hits"]["total"]["value"] > 0) {
    return res["hits"]["hits"][0]["_source"]["appointmentNumber"] + 1;
  } else {
    return 1;
  }
}

function createHalfHourIntervals(from, until) {
  //"01/01/2001" is just an arbitrary date
  until = Date.parse("01/01/2001 " + until);
  from = Date.parse("01/01/2001 " + from);
  //*2 because because we want every 30 minutes instead of every hour
  let max = (Math.abs(until - from) / (60 * 60 * 1000)) * 2;
  let time = new Date(from);
  let intervals = [];
  for (let i = 0; i <= max; i++) {
    intervals.push(time);
    time = new Date(time.getTime() + 30 * 60000);
  }
  return intervals;
}

function formatDateHHcolonMM(date) {
  // funny name but specific
  var hour = date.getHours();
  var minute = date.getMinutes();
  return (
    hour.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    }) +
    ":" +
    minute.toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    })
  );
}

async function createSessions(body) {
  try {
    // console.log("Fields to fetch 1", body);
    let duration = body.duration;
    let days = body.days;
    let year;
    let month;
    let day;
    let currentHour;
    let currentMinute;
    let endHour;
    let endMinute;
    let slots;
    let tempBody = {};
    tempBody.status = "notBooked";
    tempBody.doctorId = body.doctorId;
    let index = "booking";
    for (let i = 0; i < days.length; i++) {
      // console.log("for loop 1", days[i]);
      year = parseInt(days[i].date);
      month = Number(days[i].date.toString().substring(5, 7));
      day = Number(days[i].date.toString().substring(8));

      for (let j = 0; j < days[i].sessions.length; j++) {
        // console.log("for loop 2", days[i].sessions[j]);
        currentHour = parseInt(days[i].sessions[j].startTime);
        currentMinute = Number(
          days[i].sessions[j].startTime.toString().substring(3)
        );
        endHour = parseInt(days[i].sessions[j].endTime);
        endMinute = Number(days[i].sessions[j].endTime.toString().substring(3));
        let currentTime = new Date(
          year,
          month,
          day,
          currentHour,
          currentMinute
        );
        const end = new Date(year, month, day, endHour, endMinute);
        slots = days[i].sessions[j].sessionSlots;
        let prioritySlots = [];
        for (let k = 1; k < 6; k++) {
          let priorityBody = {};
          priorityBody.status = "notBooked";
          priorityBody.sessionId = days[i].sessions[j].sessionId;
          priorityBody.doctorId = body.doctorId;
          priorityBody.prioritySlotId = `ps0${k}${days[i].sessions[j].sessionId}`;
          prioritySlots.push(`ps0${k}${days[i].sessions[j].sessionId}`);
          await esUtil.insert(priorityBody, priorityBody.prioritySlotId, index);
        }
        days[i].sessions[j].prioritySlots = prioritySlots;

        if (
          j + 1 < days[i].sessions.length &&
          end >
            new Date(
              year,
              month,
              day,
              parseInt(days[i].sessions[j + 1].startTime),
              parseInt(days[i].sessions[j + 1].startTime)
            )
        ) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: "Conflict in session timings",
          };
        } else {
          while (currentTime < end) {
            let hours = currentTime.getHours();
            let minutes = currentTime.getMinutes();
            if (minutes == "0") {
              minutes = "00";
            }
            if (minutes < 10 && minutes > 0) {
              minutes = "0" + minutes;
            }
            if (hours == "0") {
              hours = "00";
            }
            if (hours < 10 && hours > 0) {
              hours = "0" + hours;
            }
            slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
            tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
            await esUtil.insert(tempBody, tempBody.slotId, index);
            currentTime.setMinutes(currentTime.getMinutes() + duration);
            if (currentTime >= end) {
              currentTime = end;
              hours = currentTime.getHours();
              minutes = currentTime.getMinutes();
              if (minutes == "0") {
                minutes = "00";
              }
              if (minutes < 10 && minutes > 0) {
                minutes = "0" + minutes;
              }
              if (hours == "0") {
                hours = "00";
              }
              if (hours < 10 && hours > 0) {
                hours = "0" + hours;
              }
              tempBody.sessionId = days[i].sessions[j].sessionId;
              slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
              tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
              await esUtil.insert(tempBody, tempBody.slotId, index);
            }
          }
          days[i].sessions[j].sessionSlots = slots;
        }
        // console.log("Slots generated is " + slots);
      }
    }
    // console.log("body", body.days[0].sessions);
    // console.log("body", body.days[1].sessions);
    let request = {};
    request.schedule = { schedule: body.days };
    // console.log("schedule", request.schedule);
    let data = await docController.updateProfileDetailsController(
      body.doctorId,
      "doctor",
      request.schedule
    );

    return data;
  } catch (error) {
    console.log("appointment error   ", error);
    if (error.statuscode) {
      throw error;
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}

async function bookingAppointment(body) {
  try {
    let index = "booking";
    body.appointmentId = uuid.v4();
    body.status = "booked";
    let booking;
    let slotId;
    body.bookingTimeStamp = await docController.ConvertDateFormat(
      body.bookingTimeStamp
    );
    if (body.userType == "registered") {
      slotId = body.slotId;
      booking = await docController.updateProfileDetailsController(
        slotId,
        index,
        body
      );
    } else {
      let userBody = {};
      userBody.name = body.userName;
      userBody.userType = "unRegistered";
      userBody.mobile = body.mobile;
      userBody.id = uuid.v4();
      let userOutput = await esUtil.insert(userBody, userBody.id, "user");
      if (userOutput.result === "created") {
        body.userId = userBody.id;
      } else {
        body.userId = "userProfileNotCreated";
      }
      let query = {};
      query.sort = [];
      query.sort[0] = { slotId: "asc" };
      query.query = {};
      query.query.bool = {};
      query.query.bool.must = [];
      query.query.bool.filter = [];
      query.query.bool.must[0] = { term: { sessionId: body.sessionId } };
      query.query.bool.filter[0] = { term: { status: "notBooked" } };
      let res = await esUtil.search(query, index);
      console.log(res);
      if (res.hits.total.value > 0) {
        slotId = res.hits.hits[0]._source.slotId;
        body.slotId = slotId;
        body.slotTime = res.hits.hits[0]._source.slotTime;
        booking = await docController.updateProfileDetailsController(
          slotId,
          index,
          body
        );
      } else {
        query.sort[1] = { slotTime: "desc" };
        query.sort[0] = {
          appointmentDate: "desc",
        };
        query.query.bool.filter[0] = { term: { status: "booked" } };
        let resForUnRegUser = await esUtil.search(query, index);
        let slotDate = resForUnRegUser.hits.hits[0]._source.appointmentDate;
        let year = slotDate.toString().substring(0, 4);
        let month = slotDate.toString().substring(5, 7);
        let day = slotDate.toString().substring(8);
        let hour = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(0, 2);
        let minute = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(3);
        const slotDayTime = new Date(year, month, day, hour, minute);
        let currentDate = slotDayTime.toLocaleDateString();
        console.log("before  ", slotDayTime.toLocaleDateString());
        slotDayTime.setMinutes(
          slotDayTime.getMinutes() + parseInt(body.duration)
        );
        let appointDate = slotDayTime.toLocaleDateString();

        console.log(
          "after  ",
          slotDayTime.toLocaleDateString().replaceAll("/", "-")
        );
        if (currentDate < appointDate || body.appointmentDate != currentDate) {
          body.appointmentDate = `${slotDayTime.getFullYear()}-${slotDayTime.getMonth()}-${slotDayTime.getDate()}`;
          const weekday = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ];

          console.log(slotDayTime.getDay());
          body.slotDay = weekday[slotDayTime.getDay()];
        }
        let newHour = slotDayTime.getHours();
        let newMinutes = slotDayTime.getMinutes();
        if (newMinutes == "0") {
          newMinutes = "00";
        }
        if (newMinutes < 10 && newMinutes > 0) {
          newMinutes = "0" + newMinutes;
        }
        if (newHour == "0") {
          newHour = "00";
        }
        if (newHour < 10 && newHour > 0) {
          newHour = "0" + newHour;
        }
        let slotTime = `${newHour}:${newMinutes}`;
        body.slotTime = slotTime;
        let slotId = slotTime + body.sessionId;
        body.slotId = slotId;
        let dataObj = await esUtil.insert(body, slotId, index);
        console.log(dataObj);
        if (dataObj.hasOwnProperty("result") == true) {
          if (dataObj.result == "noop") {
            booking = { results: "please enter a new Field Values to update" };
          } else {
            booking = { results: "created" };
          }
        } else {
          booking = { results: "some error occured while booking appointment" };
        }
      }
    }

    return booking;
  } catch (err) {
    console.log(err);
    throw {
      statuscode: 404,
      message: "There was some error in booking appointment",
    };
  }
}

async function searchInBooking(body) {
  try {
    let esIndex = "booking";
    let esTemplate = "bookingTemplate";
    let params = {};
    params.fromValue = body.pageNo * body.pageSize;
    params.sizeValue = body.pageSize;
    if (Object.keys(body.search).length > 0) {
      params.boolTermQuery = true;
      params.fieldName = Object.keys(body.search)[0];
      params.fieldValue = Object.values(body.search)[0];
      if (Object.keys(body.search)[0] == "doctorId") {
        params.doctorAggregation = true;
      } else if (Object.keys(body.search)[0] == "sessionId") {
        params.sessionIdAggregation = true;
      } else if (Object.keys(body.search)[0] == "appointmentDate") {
        params.appointmentDateAggregation = true;
      } else if (Object.keys(body.search)[0] == "userId") {
        params.userIdAggregation = true;
      }
    } else {
      params.boolTermQuery = false;
    }
    //generating sort filters
    if (body.sort.length > 0) {
      params.boolSort = true;
      params.sortVal = body.sort;
    } else {
      params.boolSort = false;
    }
    //processing of Filters
    if (body.filters.length > 0) {
      params.boolFilter = true;
      //console.log("in if")
      for (let i = 0; i < body.filters.length; i++) {
        let key = Object.keys(body.filters[i])[0];
        let value = Object.values(body.filters[i])[0];
        params = searchController.generateFilterStructure(params, key, value);
      }
    } else {
      params.boolFilter = false;
    }
    let output = {};
    let dataOb = await esUtil.templateSearch(params, esIndex, esTemplate);
    output.hits = dataOb.hits.total.value;
    let searchAggs = dataOb["aggregations"]["TotalAggs"];
    // let searchFilterAggs = aggsFunc.aggegrationsData(searchAggs);
    output.result = dataOb.hits.hits.map((e) => {
      return e._source;
    });
    let key = [];
    let arr = [];
    if (Object.keys(body.search)[0] == "doctorId") {
      key = Object.keys(searchAggs.doctorAggs);
      for (let i = 0; i < key.length - 1; i++) {
        let name = key[i + 1];
        arr[i] = { [name]: searchAggs.doctorAggs[name] };
      }
    } else if (Object.keys(body.search)[0] == "sessionId") {
      key = Object.keys(searchAggs.sessionIdAggs);
      for (let i = 0; i < key.length - 1; i++) {
        let name = key[i + 1];
        arr[i] = { [name]: searchAggs.sessionIdAggs[name] };
      }
    } else if (Object.keys(body.search)[0] == "appointmentDate") {
      key = Object.keys(searchAggs.appointmentDateAggs);
      for (let i = 0; i < key.length - 1; i++) {
        let name = key[i + 1];
        arr[i] = { [name]: searchAggs.appointmentDateAggs[name] };
      }
    } else if (Object.keys(body.search)[0] == "userId") {
      key = Object.keys(searchAggs.userIdAggs);
      for (let i = 0; i < key.length - 1; i++) {
        let name = key[i + 1];
        arr[i] = { [name]: searchAggs.userIdAggs[name] };
      }
    }

    output.filters = arr;

    return output;
  } catch (err) {
    console.log(err);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

module.exports = {
  getSchedule,
  bookAppointment,
  createSessions,
  bookingAppointment,
  searchInBooking,
};
