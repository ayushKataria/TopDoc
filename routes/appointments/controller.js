"use strict";
const esUtil = require("../../utils/es_util");
const uuid = require("uuid");
const moment = require("moment");
const docController = require("../doctors/controller");
const searchController = require("../search/controller");
const appointmentAttributeList = require("./constants/appointmentAttributeList");
const aggsFunc = require("../search/searchAggrigation");
const _ = require("underscore");
const notificationWrapper = require("../notification/wrapper");

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
    let duration;
    let minSlotDuration = 4;
    let sessionDuration;
    let minSessionDuration = 30;
    let maxSessionDuration = 240;
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
      year = days[i].date.toString().substring(0, 4);
      month = parseInt(days[i].date.toString().substring(5, 7)) - 1;
      day = days[i].date.toString().substring(8);

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
        sessionDuration = (end - currentTime) / 60000;
        duration = sessionDuration / days[i].sessions[j].slotsCount;
        console.log(
          "duration is  ",
          duration,
          "for slots Counts  ",
          days[i].sessions[j].slotsCount
        );

        slots = days[i].sessions[j].sessionSlots;
        if (end <= currentTime) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Conflict in session timings within a session for date = ${days[i].date}`,
          };
        } else if ((end - currentTime) / 60000 < parseInt(duration)) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `startTime and endTime difference is less than slot duration within a session for date = ${days[i].date}`,
          };
        } else if (
          j + 1 < days[i].sessions.length &&
          end >
            new Date(
              year,
              month,
              day,
              parseInt(
                days[i].sessions[j + 1].startTime.toString().substring(0, 2)
              ),
              parseInt(
                days[i].sessions[j + 1].startTime.toString().substring(3)
              )
            )
        ) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Conflict in session timings between sessions of date = ${days[i].date}`,
          };
        } else if (sessionDuration < minSessionDuration) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Session Duration is less than the Minimum limit of ${minSessionDuration} minutes. Try Increasing the Session Duration for sessionId ${days[i].sessions[j].sessionId}`,
          };
        } else if (sessionDuration > maxSessionDuration) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Session Duration is more than the Maximum limit of ${minSessionDuration} minutes. Try Reducing the Session Duration for sessionId ${days[i].sessions[j].sessionId}`,
          };
        } else if (duration < minSlotDuration) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Slot Duration is less than the Minimum limit of ${minSlotDuration} minutes. Try reducing the number of slots OR Increase the Session Duration for sessionId ${days[i].sessions[j].sessionId}`,
          };
        } else if (duration > sessionDuration) {
          throw {
            statuscode: 400,
            err: "Bad Request",
            message: `Slot Duration is more than the Maximum limit of ${minSlotDuration} minutes. Try increasing the number of slots OR Reduce the Session Duration for sessionId ${days[i].sessions[j].sessionId}`,
          };
        } else {
          let prioritySlots = [];
          let prioritySlotsCount = Math.ceil(
            days[i].sessions[j].slotsCount / 5
          );
          console.log("priority slots number are ", prioritySlotsCount);
          for (let k = 1; k < prioritySlotsCount + 1; k++) {
            let priorityBody = {};
            priorityBody.status = "notBooked";
            priorityBody.sessionId = days[i].sessions[j].sessionId;
            priorityBody.sessionStartTime = days[i].sessions[j].startTime;
            priorityBody.sessionEndTime = days[i].sessions[j].endTime;
            priorityBody.clinicId = days[i].sessions[j].clinic.clinicId;
            priorityBody.clinicDetails = days[i].sessions[j].clinic;
            priorityBody.slotDuration = Math.round(duration);
            priorityBody.doctorId = body.doctorId;
            priorityBody.appointmentDate = days[i].date;
            priorityBody.slotDay =
              appointmentAttributeList.weekday[currentTime.getDay()];
            priorityBody.slotType = "priority";
            priorityBody.paymentStatus = "default";
            priorityBody.prioritySlotId = `ps0${k}${days[i].sessions[j].sessionId}`;
            prioritySlots.push(`ps0${k}${days[i].sessions[j].sessionId}`);
            await esUtil.insert(
              priorityBody,
              priorityBody.prioritySlotId,
              index
            );
          }
          days[i].sessions[j].prioritySlots = prioritySlots;
          while (currentTime < end) {
            let hours = currentTime.getHours().toString().padStart(2, "0");
            let minutes = currentTime.getMinutes().toString().padStart(2, "0");
            tempBody.doctorId = body.doctorId;
            tempBody.sessionId = days[i].sessions[j].sessionId;
            tempBody.slotTime = `${hours}:${minutes}`;
            tempBody.predictedSlotTime = `${hours}:${minutes}`;
            tempBody.appointmentDate = days[i].date;
            tempBody.slotType = "normal";
            tempBody.sessionStartTime = days[i].sessions[j].startTime;
            tempBody.sessionEndTime = days[i].sessions[j].endTime;
            tempBody.clinicId = days[i].sessions[j].clinic.clinicId;
            tempBody.clinicDetails = days[i].sessions[j].clinic;
            // tempBody.slotDuration = body.duration;
            tempBody.paymentStatus = "default";
            tempBody.slotDay =
              appointmentAttributeList.weekday[currentTime.getDay()];
            slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
            tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
            let tempCurrentTime = new Date(currentTime);
            currentTime.setMilliseconds(
              currentTime.getMilliseconds() + Math.round(duration * 60000)
            );
            console.log("current : ", currentTime, "end : ", end);
            if (currentTime > end) {
              console.log("hererererererer");
              currentTime = end;
            }

            if (currentTime < end) {
              console.log("inside if ", currentTime - tempCurrentTime);
              hours = currentTime.getHours().toString().padStart(2, "0");
              minutes = currentTime.getMinutes().toString().padStart(2, "0");
              tempBody.endTime = `${hours}:${minutes}`;
              let endTimeMinutes =
                parseInt(tempBody.endTime.toString().substring(0, 2)) * 60 +
                parseInt(tempBody.endTime.toString().substring(3, 5));
              let slotTimeMinutes =
                parseInt(tempBody.slotTime.toString().substring(0, 2)) * 60 +
                parseInt(tempBody.slotTime.toString().substring(3, 5));
              tempBody.slotDuration = endTimeMinutes - slotTimeMinutes;
              await esUtil.insert(tempBody, tempBody.slotId, index);
            } else if (
              currentTime.getTime() == end.getTime() &&
              currentTime - tempCurrentTime >= 240000
            ) {
              console.log("inside else if ", currentTime - tempCurrentTime);

              currentTime = end;
              hours = currentTime.getHours().toString().padStart(2, "0");
              minutes = currentTime.getMinutes().toString().padStart(2, "0");
              tempBody.endTime = `${hours}:${minutes}`;
              let endTimeMinutes =
                parseInt(tempBody.endTime.toString().substring(0, 2)) * 60 +
                parseInt(tempBody.endTime.toString().substring(3, 5));
              let slotTimeMinutes =
                parseInt(tempBody.slotTime.toString().substring(0, 2)) * 60 +
                parseInt(tempBody.slotTime.toString().substring(3, 5));
              tempBody.slotDuration = endTimeMinutes - slotTimeMinutes;
              await esUtil.insert(tempBody, tempBody.slotId, index);
            }
            // hours = currentTime.getHours().toString().padStart(2, "0");
            // minutes = currentTime.getMinutes().toString().padStart(2, "0");
            // tempBody.endTime = `${hours}:${minutes}`;
            // // if (currentTime > end) {
            // //   currentTime = end;
            // //   hours = currentTime.getHours().toString().padStart(2, "0");
            // //   minutes = currentTime.getMinutes().toString().padStart(2, "0");
            // //   tempBody.doctorId = body.doctorId;
            // //   tempBody.sessionId = days[i].sessions[j].sessionId;
            // //   tempBody.slotTime = `${hours}:${minutes}`;
            // //   tempBody.predictedSlotTime = `${hours}:${minutes}`;
            // //   tempBody.appointmentDate = days[i].date;
            // //   tempBody.slotType = "normal";
            // //   tempBody.sessionStartTime = days[i].sessions[j].startTime;
            // //   tempBody.sessionEndTime = days[i].sessions[j].endTime;
            // //   tempBody.clinicId = days[i].sessions[j].clinic.clinicId;
            // //   tempBody.clinicDetails = days[i].sessions[j].clinic;
            // //   tempBody.slotDuration = body.duration;
            // //   tempBody.paymentStatus = "default";
            // //   tempBody.slotDay =
            // //     appointmentAttributeList.weekday[currentTime.getDay()];
            // //   slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
            // //   tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
            // //   currentTime.setMinutes(currentTime.getMinutes() + duration);
            // //   hours = currentTime.getHours().toString().padStart(2, "0");
            // //   minutes = currentTime.getMinutes().toString().padStart(2, "0");
            // //   tempBody.endTime = `${hours}:${minutes}`;
            // //   await esUtil.insert(tempBody, tempBody.slotId, index);
            // // }
            // await esUtil.insert(tempBody, tempBody.slotId, index);
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
    console.log("schedule", request.schedule);
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
    let booking = {};
    let slotId;
    body.bookingTimeStamp = await docController.ConvertDateFormat(
      body.bookingTimeStamp
    );
    console.log("bookingTime");
    if (body.userType == "registered") {
      slotId = body.slotId;
      body.queueId =
        body.appointmentDate.replaceAll("-", "") +
        body.slotId.substring(0, 2) +
        body.slotId.substring(3, 5);
      let res1 = await docController.getProfileDetailsController(
        slotId,
        index,
        ["status"]
      );
      if (res1.results[0].status == "booked") {
        throw {
          statuscode: 400,
          message: "Bad request , The slot is already booked",
        };
      } else {
        booking = await docController.updateProfileDetailsController(
          slotId,
          index,
          body
        );
        if (booking.results == "updated") {
          booking.appointmentId = body.appointmentId;
        }
      }
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
      query.size = 10000;
      query.sort = [];
      query.sort[0] = { slotId: "asc" };
      query.query = {};
      query.query.bool = {};
      query.query.bool.must = [];
      query.query.bool.filter = [];
      query.query.bool.must[0] = { term: { sessionId: body.sessionId } };
      query.query.bool.filter[0] = { term: { status: "notBooked" } };
      query.query.bool.filter[1] = { term: { slotType: "normal" } };
      let res = await esUtil.search(query, index);
      console.log(res);
      if (res.hits.total.value > 0) {
        slotId = res.hits.hits[0]._source.slotId;
        body.slotId = slotId;
        body = _.omit(body, "duration", "appointmentDate", "slotDay");
        body.slotTime = res.hits.hits[0]._source.slotTime;
        body.queueId =
          res.hits.hits[0]._source.appointmentDate.replaceAll("-", "") +
          slotId.substring(0, 2) +
          body.slotId.substring(3, 5);
        booking = await docController.updateProfileDetailsController(
          slotId,
          index,
          body
        );
        if (booking.results == "updated") {
          booking.appointmentId = body.appointmentId;
        }
      } else {
        query.sort[1] = { slotTime: "desc" };
        query.sort[0] = {
          appointmentDate: "desc",
        };
        // query.query.bool.filter[0] = { term: { status: "booked" } };
        query.query.bool.filter[0] = { term: { slotType: "normal" } };
        // console.log("query ", JSON.stringify(query));
        let resForUnRegUser = await esUtil.search(query, index);
        console.log(resForUnRegUser.hits.hits[0]._source);
        let slotDate = resForUnRegUser.hits.hits[0]._source.appointmentDate;
        let slotDuration = resForUnRegUser.hits.hits[0]._source.slotDuration;
        console.log(slotDate);
        let year = slotDate.toString().substring(0, 4);
        console.log(year);
        let month = (parseInt(slotDate.toString().substring(5, 7)) - 1)
          .toString()
          .padStart(2, "0");
        console.log(month);
        let day = slotDate.toString().substring(8);
        let hour = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(0, 2);
        console.log(hour);
        let minute = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(3);
        console.log(minute);
        let slotDayTime = new Date(year, month, day, hour, minute);
        console.log(slotDayTime);
        let currentDate = slotDayTime.toLocaleDateString();
        console.log("before  ", slotDayTime.toLocaleDateString());
        slotDayTime.setMinutes(
          slotDayTime.getMinutes() + parseInt(slotDuration)
        );
        let appointDate = slotDayTime.toLocaleDateString();

        console.log(
          "after  ",
          slotDayTime.toLocaleDateString().replaceAll("/", "-")
        );
        // if (currentDate < appointDate || body.appointmentDate != currentDate) {
        body.appointmentDate = `${slotDayTime.getFullYear()}-${(
          slotDayTime.getMonth() + 1
        )
          .toString()
          .padStart(2, "0")}-${slotDayTime
          .getDate()
          .toString()
          .padStart(2, "0")}`;

        console.log(slotDayTime.getDay());
        body.slotDay = appointmentAttributeList.weekday[slotDayTime.getDay()];
        // }
        let newHour = slotDayTime.getHours().toString().padStart(2, "0");
        let newMinutes = slotDayTime.getMinutes().toString().padStart(2, "0");
        let slotTime = `${newHour}:${newMinutes}`;
        console.log(slotTime);
        body.slotTime = slotTime;
        body.predictedSlotTime = slotTime;
        let slotId = slotTime + body.sessionId;
        body.slotId = slotId;
        body.doctorId = resForUnRegUser.hits.hits[0]._source.doctorId;
        body.sessionId = resForUnRegUser.hits.hits[0]._source.sessionId;
        body.sessionStartTime =
          resForUnRegUser.hits.hits[0]._source.sessionStartTime;
        body.sessionEndTime =
          resForUnRegUser.hits.hits[0]._source.sessionEndTime;
        body.clinicId = resForUnRegUser.hits.hits[0]._source.clinicId;
        body.clinicDetails = resForUnRegUser.hits.hits[0]._source.clinicDetails;
        body.slotDuration = slotDuration;
        body.queueId =
          body.appointmentDate.replaceAll("-", "") +
          slotId.substring(0, 2) +
          body.slotId.substring(3, 5);
        slotDayTime.setMinutes(
          slotDayTime.getMinutes() + parseInt(slotDuration)
        );
        newHour = slotDayTime.getHours().toString().padStart(2, "0");
        newMinutes = slotDayTime.getMinutes().toString().padStart(2, "0");
        body.endTime = `${newHour}:${newMinutes}`;
        let dataObj = await esUtil.insert(body, slotId, index);
        console.log(dataObj);
        if (dataObj.hasOwnProperty("result") == true) {
          if (dataObj.result == "noop") {
            booking = { results: "please enter a new Field Values to update" };
          } else {
            booking = {
              results: "created",
              appointmentId: body.appointmentId,
            };
          }
        } else {
          booking = { results: "some error occured while booking appointment" };
        }
      }
    }

    return booking;
  } catch (err) {
    console.log(err);
    if (err.message == "Bad request , The slot is already booked") {
      throw {
        statuscode: 400,
        message: "Bad request , The slot is already booked",
      };
    } else {
      throw {
        statuscode: 400,
        message: "There was some error in booking appointment",
      };
    }
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
      if (Object.keys(body.search).includes("range") == true) {
        params.boolRangeComma = true;
        params.boolRangeQuery = true;
        params.rangeField = Object.keys(body.search.range)[0];
        params.gteValue =
          body.search.range[Object.keys(body.search.range)[0]].gte;
        params.lteValue =
          body.search.range[Object.keys(body.search.range)[0]].lte;
        console.log("params  ", params);
      }
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
    if (
      params.fieldName == "doctorId" &&
      Object.keys(body.search).includes("range") &&
      params.rangeField == "appointmentDate"
    ) {
      let finalArr = [];
      let buckets = [];
      let targetIndex;
      let ind = -1;
      arr.filter((e) => {
        ++ind;
        if (Object.keys(e) == "results_by_date") {
          buckets = e.results_by_date.buckets;
          targetIndex = ind;
        }
      });
      let l = -1;
      buckets.map((e) => {
        ++l;
        finalArr.push({});
        finalArr[l].appointmentDate = e.key_as_string;
        finalArr[l].hits = e.doc_count;
        let g = -1;
        let sessionsArr = [];
        e.unique_field_values.buckets.map((w) => {
          ++g;
          sessionsArr.push({});
          sessionsArr[g].sessionId = w.key;
          sessionsArr[g].hits = w.doc_count;
          sessionsArr[g].documents = w.documents.hits.hits;
        });
        finalArr[l].sessions = sessionsArr;
      });
      let obj = {};
      obj.results_by_date = {};
      obj.results_by_date.buckets = [];
      obj.results_by_date.buckets = finalArr;
      arr.splice(targetIndex, 1);
      arr.splice(0, 0, obj);
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

async function delaySessionByDuration(body) {
  try {
    let index = "booking";
    let userList = [];
    let output = {};
    let query = {};
    query.size = 10000;
    query.sort = [];
    query.sort[0] = { slotId: "asc" };
    query.query = {};
    query.query.bool = {};
    query.query.bool.must = [];
    query.query.bool.filter = [];
    query.query.bool.must[0] = { term: { sessionId: body.sessionId } };
    query.query.bool.filter[0] = { term: { doctorId: body.doctorId } };
    let res = await esUtil.search(query, index);
    output.hits = res.hits.total.value;
    if (res.hits.total.value > 0) {
      let slots = res.hits.hits.map((e) => {
        if (Object.keys(e._source).includes("slotTime")) {
          let slotTime = e._source.slotTime;
          let slotDate = e._source.appointmentDate;
          let year = parseInt(slotDate.toString().substring(0, 4));
          let month = (parseInt(slotDate.toString().substring(5, 7)) - 1)
            .toString()
            .padStart(2, "0");
          let day = parseInt(slotDate.toString().substring(8));
          let hour = parseInt(slotTime.toString().substring(0, 2))
            .toString()
            .padStart(2, "0");
          let minute = parseInt(slotTime.toString().substring(3))
            .toString()
            .padStart(2, "0");
          let slotDayTime = new Date(year, month, day, hour, minute);
          slotDayTime.setMinutes(
            slotDayTime.getMinutes() + parseInt(body.sessionDelayDuration)
          );
          e._source.slotTime = `${slotDayTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${slotDayTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          e._source.predictedSlotTime = `${slotDayTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${slotDayTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          e._source.appointmentDate = `${slotDayTime.getFullYear()}-${(
            slotDayTime.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${slotDayTime
            .getDate()
            .toString()
            .padStart(2, "0")}`;
          e._source.slotDay = `${
            appointmentAttributeList.weekday[slotDayTime.getDay()]
          }`;
          slotDayTime.setMinutes(
            slotDayTime.getMinutes() + parseInt(e._source.slotDuration)
          );
          e._source.endTime = `${slotDayTime
            .getHours()
            .toString()
            .padStart(2, "0")}:${slotDayTime
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;
          return e._source;
        }
      });
      let j = 0;

      for (let i = 0; i < slots.length; i++) {
        if (slots[i] != null) {
          if (Object.keys(slots[i]).includes("userId")) {
            userList[j] = {
              id: slots[i].userId,
              name: slots[i].userName,
              mobile: slots[i].mobile,
              email: slots[i].email,
            };
            j++;
          }
          await docController.updateProfileDetailsController(
            slots[i].slotId,
            index,
            slots[i]
          );
        }
      }
      output.result = "updated";
      let message = `We regret to inform that, your doctor has been delayed the session by ${body.sessionDelayDuration} minutes, apologies for inconvenience`;
      let medium = [app, sms, mail];
      triggerNotification("delaySession", message, userList, medium);
      // let notifBody = {
      //   tag: ["delay"],
      //   priority: "high",
      //   message: `We regret to inform that, your doctor has been delayed the session by ${body.sessionDelayDuration} minutes, apologies for inconvenience`,
      //   time: moment().format("YYYY-MM-DDTHH:mm:ss"),
      //   status: "delivered",
      //   medium: ["app", "mail"],
      //   senderId: ["application", 7999411516],
      // };
      // await notificationWrapper.sessionAnnouncement(userList, notifBody);
    } else if (res.hits.total.value == 0) {
      output.result = "No records found for the given sessionId";
    } else {
      throw error;
    }
    return output;
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

async function queueManagement(body) {
  try {
    let index = "booking";
    let totalSlotsBooked = [];
    let totalPrioritySlotBooked = [];
    let indexOfTotalPrioritySlotBooked = [];
    let totalRejoinedSlots = [];
    let upNextSlots = [];
    let indexOfTotalRejoinedSlots = [];
    let indexOfUpNextSlots = [];
    let output = {};
    let slotDelay;
    let Query = {
      size: 10000,
      sort: [
        {
          appointmentDate: "asc",
        },
        {
          slotId: "asc",
        },
        {
          rejoinTimeStamp: "asc",
        },
      ],
      query: {
        bool: {
          must: [
            {
              term: {
                sessionId: body.sessionId,
              },
            },
          ],
          must_not: [
            {
              term: {
                status: "notBooked",
              },
            },
            {
              term: {
                status: "cancelled",
              },
            },
            {
              term: {
                status: "ended",
              },
            },
          ],
          filter: [],
        },
      },
    };

    let res = await esUtil.search(Query, index);
    output.hits = res.hits.total.value;
    totalSlotsBooked = res.hits.hits.map((e) => {
      return e._source;
    });
    let k = -1;
    totalPrioritySlotBooked = totalSlotsBooked.filter((e) => {
      ++k;
      if (e.slotType == "priority") {
        indexOfTotalPrioritySlotBooked.push(k);
        return e;
      }
    });
    let m = 0;
    for (let x = 0; x < indexOfTotalPrioritySlotBooked.length; x++) {
      totalSlotsBooked.splice(indexOfTotalPrioritySlotBooked[x] - m, 1);
      m++;
    }
    let j = 0;
    if (totalPrioritySlotBooked.length > 0) {
      for (let i = 0; i < totalSlotsBooked.length; i++) {
        if (i == 0) {
          totalSlotsBooked.splice(i, 0, totalPrioritySlotBooked[j]);
          j++;
        } else if (
          totalPrioritySlotBooked[j].appointmentDate <=
          totalSlotsBooked[i].appointmentDate
        ) {
          totalSlotsBooked.splice(i, 0, totalPrioritySlotBooked[j]);
          j++;
        } else if (
          i % 2 == 0 &&
          totalPrioritySlotBooked[j].slotId > totalSlotsBooked[i].slotId
        ) {
          totalSlotsBooked.splice(i, 0, totalPrioritySlotBooked[j]);
          j++;
        }
        if (j == totalPrioritySlotBooked.length) {
          break;
        }
      }
      if (j != totalPrioritySlotBooked.length) {
        for (let g = j; g < totalPrioritySlotBooked.length; g++) {
          totalSlotsBooked.push(totalPrioritySlotBooked[g]);
        }
      }
    }

    let l = -1;
    totalRejoinedSlots = totalSlotsBooked.filter((e) => {
      ++l;
      if (e.status == "rejoined") {
        indexOfTotalRejoinedSlots.push(l);
        return e;
      }
    });
    if (totalRejoinedSlots.length > 0) {
      let a = -1;
      upNextSlots = totalSlotsBooked.filter((e) => {
        ++a;
        if (e.status == "upNext") {
          indexOfUpNextSlots.push(a);
          return e;
        }
      });
      let n = 0;
      for (let x = 0; x < indexOfTotalRejoinedSlots.length; x++) {
        totalSlotsBooked.splice(indexOfTotalRejoinedSlots[x] - n, 1);
        n++;
      }
      for (let i = 1; i <= totalRejoinedSlots.length; i++) {
        totalSlotsBooked.splice(
          indexOfUpNextSlots[0] + i - indexOfTotalRejoinedSlots.length,
          0,
          totalRejoinedSlots[i - 1]
        );
      }
    }
    let lastEndedObject = {};
    let indexOfStarted;
    let f = -1;
    totalSlotsBooked.find((e) => {
      ++f;
      if (e.status == "ended" || e.status == "paused") {
        lastEndedObject = e;
      }
      if (e.status == "started" || e.status == "upNext") {
        if (e.status == "started") {
          indexOfStarted = f + 1;
        }
        if (e.status == "upNext") {
          indexOfStarted = f;
        }

        return e;
      }
    });
    if (Object.keys(lastEndedObject).length > 0) {
      let endTime = returnDateTime(
        lastEndedObject.appointmentDate,
        lastEndedObject.endTime
      );
      let actualEndTime = new Date(lastEndedObject.actualEndTime);
      let difference = actualEndTime - endTime;
      let differenceInMinutes = difference / 1000 / 60;
      if (differenceInMinutes > 0) {
        slotDelay = `${Math.floor(differenceInMinutes / 60)
          .toString()
          .padStart(2, "0")}:${(differenceInMinutes % 60)
          .toString()
          .padStart(2, "0")}`;
      } else {
        slotDelay = `-${(Math.ceil(differenceInMinutes / 60) * -1)
          .toString()
          .padStart(2, "0")}:${((differenceInMinutes % 60) * -1)
          .toString()
          .padStart(2, "0")}`;
      }
      output.delay = slotDelay;

      for (let i = indexOfStarted; i < totalSlotsBooked.length; i++) {
        let originalSlotTime = returnDateTime(
          totalSlotsBooked[i].appointmentDate,
          totalSlotsBooked[i].slotTime
        );
        let predictedTime = new Date(
          originalSlotTime.setMinutes(
            originalSlotTime.getMinutes() + differenceInMinutes
          )
        );
        totalSlotsBooked[i].predictedSlotTime = `${predictedTime
          .getHours()
          .toString()
          .padStart(2, "0")}:${predictedTime
          .getMinutes()
          .toString()
          .padStart(2, "0")}`;
      }
    }

    output.results = totalSlotsBooked;
    return output;
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}
async function cancelDoctorSession(body) {
  try {
    let index = "booking";
    let userList = [];
    let totalSlots = [];
    let output = {};
    let Query = {
      size: 10000,
      sort: [
        {
          appointmentDate: "asc",
        },
        {
          slotId: "asc",
        },
      ],
      query: {
        bool: {
          must: [
            {
              term: {
                doctorId: body.doctorId,
              },
            },
          ],
          filter: [
            {
              term: {
                sessionId: body.sessionId,
              },
            },
          ],
        },
      },
    };

    let res = await esUtil.search(Query, index);
    output.hits = res.hits.total.value;
    if (res.hits.total.value > 0) {
      let v = -1;
      totalSlots = res.hits.hits.map((e) => {
        e._source.status = "cancelled";
        if (e._source.hasOwnProperty("appointmentId")) {
          ++v;
          userList[v] = {
            id: e._source.userId,
            name: e._source.userName,
            mobile: e._source.mobile,
            email: e._source.email,
          };
        }
        return e._source;
      });
      let esbody = {};
      esbody.status = body.status;
      for (let i = 0; i < totalSlots.length; i++) {
        await docController.updateProfileDetailsController(
          totalSlots[i].slotId,
          index,
          esbody
        );
      }
      output.result = "updated";
      let message = `We regret to inform that, your doctor has been cancelled the session, apologies for inconvenience`;
      let medium = [app, sms, mail];
      triggerNotification("cancelSession", message, userList, medium);
      // let notifBody = {
      //   tag: ["cancelSession"],
      //   priority: "high",
      //   message: `We regret to inform that, your doctor has been cancelled the session, apologies for inconvenience`,
      //   time: moment().format("YYYY-MM-DDTHH:mm:ss"),
      //   status: "delivered",
      //   medium: ["app", "sms", "mail"],
      //   senderId: ["application", 7999411516, "topdoc@gmail.com"],
      // };
      // await notificationWrapper.sessionAnnouncement(userList, notifBody);
    } else if (res.hits.total.value == 0) {
      output.result = "No records found for the given sessionId";
    } else {
      throw error;
    }

    return output;
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}
async function changeBookingStatus(body) {
  try {
    let role = "booking";
    let output = {};
    let data = {};
    body.timeStamp = new Date(body.timeStamp);
    if (body.status == "ended" || body.status == "paused") {
      let query = { status: body.status };
      try {
        data = await docController.updateProfileDetailsController(
          body.slotId,
          role,
          query
        );
      } catch (error) {
        output.status = "Some Error Occured !";
      }

      if (data.hasOwnProperty("results") == true) {
        output.status = data.results;
        if (data.results == "updated") {
          let userList = [];
          let totalSlots = [];
          let output = {};
          let Query = {
            size: 10000,
            sort: [
              {
                appointmentDate: "asc",
              },
              {
                slotId: "asc",
              },
            ],
            query: {
              bool: {
                must: [
                  {
                    term: {
                      doctorId: body.doctorId,
                    },
                  },
                ],
                filter: [
                  {
                    term: {
                      sessionId: body.currSessionId,
                    },
                  },
                ],
              },
            },
          };

          let res = await esUtil.search(Query, role);
          output.hits = res.hits.total.value;
          if (res.hits.total.value > 0) {
            let v = -1;
            totalSlots = res.hits.hits.map((e) => {
              if (e._source.hasOwnProperty("appointmentId")) {
                ++v;
                userList[v] = {
                  id: e._source.userId,
                  name: e._source.userName,
                  mobile: e._source.mobile,
                  email: e._source.email,
                };
              }
              return e._source;
            });
            let message = `queue refreshed`;
            let medium = [app];
            triggerNotification("QueueReload", message, userList, medium);
            // let notifBody = {
            //   tag: ["QueueReload"],
            //   priority: "high",
            //   message: `We regret to inform that, your doctor has been cancelled the session, apologies for inconvenience`,
            //   time: moment().format("YYYY-MM-DDTHH:mm:ss"),
            //   status: "delivered",
            //   medium: ["app", "sms", "mail"],
            //   senderId: ["application", 7999411516, "topdoc@gmail.com"],
            // };
            // await notificationWrapper.sessionAnnouncement(userList, notifBody);
          }
        }
      }
    }

    let predictedTime = await forecastQueueEndTime(
      body.currSessionStartTime,
      body.totalSlots,
      body.completedSlots,
      body.timeStamp,
      body.appointmentDate
    );

    let areSessionClashing = await areSessionsClashing(
      body.currSessionEndTime,
      predictedTime.predictedSessionEndTime,
      body.nextSessionStartTime,
      body.appointmentDate
    );

    let hours = new Date(predictedTime.predictedSessionEndTime)
      .getHours()
      .toString()
      .padStart(2, "0");
    let minutes = new Date(predictedTime.predictedSessionEndTime)
      .getMinutes()
      .toString()
      .padStart(2, "0");
    output.askForDelay = areSessionClashing.askForDelay;
    output.predictedSessionEndTime = `${hours}:${minutes}`;
    output.currentSpeed = predictedTime.currentSpeed;
    output.timeExceedingOrgEstimation =
      areSessionClashing.timeExceedingOrgEstimation;

    return output;
  } catch (error) {
    console.log(error);
    if (error.statuscode) {
      throw error;
    }
    throw {
      statuscode: 500,
      message: "Unexpected error occured",
    };
  }
}

function returnDateTime(dateOfDay, timeOfDay) {
  let year = parseInt(dateOfDay.toString().substring(0, 4));
  let month = (parseInt(dateOfDay.toString().substring(5, 7)) - 1)
    .toString()
    .padStart(2, "0");
  let day = parseInt(dateOfDay.toString().substring(8));
  let hour = parseInt(timeOfDay.toString().substring(0, 2))
    .toString()
    .padStart(2, "0");
  let minute = parseInt(timeOfDay.toString().substring(3))
    .toString()
    .padStart(2, "0");
  return new Date(year, month, day, hour, minute);
}

async function forecastQueueEndTime(
  currSessionStartTime,
  totalSlots,
  completedSlots,
  timeStamp,
  appointmentDate
) {
  let result = {};
  currSessionStartTime = await returnDateTime(
    appointmentDate,
    currSessionStartTime
  );
  let timeElapsed = (timeStamp - currSessionStartTime) / 60000;
  let currentSpeed =
    Math.round((timeElapsed / completedSlots + Number.EPSILON) * 100) / 100;
  let netTimeToComplete = currentSpeed * (totalSlots - completedSlots);
  let predictedSessionEndTime = new Date(
    timeStamp.setMinutes(timeStamp.getMinutes() + netTimeToComplete)
  );
  result.predictedSessionEndTime = predictedSessionEndTime;
  result.currentSpeed = currentSpeed;

  return result;
}

async function areSessionsClashing(
  currSessionEndTime,
  predictedSessionEndTime,
  nextSessionStartTime,
  appointmentDate
) {
  let result = {};
  result.askForDelay = false;
  currSessionEndTime = await returnDateTime(
    appointmentDate,
    currSessionEndTime
  );
  nextSessionStartTime = await returnDateTime(
    appointmentDate,
    nextSessionStartTime
  );
  let buffer = ((nextSessionStartTime - currSessionEndTime) * 0.5) / 60000;
  if (
    predictedSessionEndTime >
    nextSessionStartTime.setMinutes(nextSessionStartTime.getMinutes() - buffer)
  ) {
    result.askForDelay = true;
    result.timeExceedingOrgEstimation = Math.round(
      (predictedSessionEndTime - nextSessionStartTime) / 60000
    );
  }
  return result;
}
async function triggerNotification(tag, message, userList, medium) {
  let notifBody = {
    tag: tag,
    priority: "high",
    message: message,
    time: moment().format("YYYY-MM-DDTHH:mm:ss"),
    status: "not delivered",
    medium: medium,
  };
  await notificationWrapper.sessionAnnouncement(userList, notifBody);
}
module.exports = {
  getSchedule,
  bookAppointment,
  createSessions,
  bookingAppointment,
  searchInBooking,
  delaySessionByDuration,
  queueManagement,
  cancelDoctorSession,
  changeBookingStatus,
  returnDateTime,
  forecastQueueEndTime,
  areSessionsClashing,
  triggerNotification,
};
