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
    console.log("Fields to fetch 1", body);
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
        // let currentTime = convertToInt(days[i].sessions[j].startTime);
        // const end = convertToInt(days[i].sessions[j].endTime);
        // console.log("try", currentTime, "again ", end);
        slots = days[i].sessions[j].sessionSlots;
        // let fh = parseInt(days[i].sessions[j + 1].startTime);
        // let fmin = parseInt(days[i].sessions[j + 1].startTime);
        let prioritySlots = [];
        for (let k = 1; k < 6; k++) {
          let priorityBody = {};
          priorityBody.status = "notBooked";
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
            // console.log("The End is " + end + "curr time is " + currentTime);
            // let hours = Number(currentTime.toString().substring(0, 2));
            // let minutes = Number(currentTime.toString().substring(2));

            // if (minutes >= 60) {
            //   hours = hours + Math.floor(minutes / 60);
            //   minutes = minutes - 60;
            //   currentTime = hours * 100 + minutes;
            // }
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
            // console.log("Hours is " + hours + " min is " + minutes);
            // const seconds = currentTime.getSeconds();
            // if (Number(`${hours}${minutes}`) > end) {
            //   hours = Number(end.toString().substring(0, 2));
            //   minutes = Number(end.toString().substring(2));
            //   if (minutes == "0") {
            //     minutes = "00";
            //   }
            //   if (minutes < 10 && minutes > 0) {
            //     slots.push(`${hours}:0${minutes}`);
            //   } else {
            slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
            tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
            // console.log(tempBody, "         ", tempBody.slotId);
            await esUtil.insert(tempBody, tempBody.slotId, index);
            // }
            // } else {
            // console.log(`${hours}:${minutes}`);
            // if (minutes < 10 && minutes > 0) {
            //   slots.push(`${hours}:0${minutes}`);
            // } else {
            //   slots.push(`${hours}:${minutes}`);
            // }
            // }

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
              slots.push(`${hours}:${minutes}${days[i].sessions[j].sessionId}`);
              tempBody.slotId = `${hours}:${minutes}${days[i].sessions[j].sessionId}`;
              // console.log(tempBody, "         ", tempBody.slotId);
              await esUtil.insert(tempBody, tempBody.slotId, index);
            }
            // currentTime = Number(convertToInt(currentTime)) + Number(duration);
          }
          days[i].sessions[j].sessionSlots = slots;
          // console.log("Slots generated is " + slots);
          // return slots;

            startTime = startTime + duration;
          }
          console.log("Slots generated is " + slots);
        }
      }
    }

    console.log("body", body.days[0].sessions);
    console.log("body", body.days[1].sessions);
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
    console.log(body);
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
        body.userId = "profileNotCreated";
      }
      let query = {};
      // console.log(query);
      query.sort = [];
      // console.log(query);
      query.sort[0] = { slotId: "asc" };
      // console.log(query);
      query.query = {};
      // console.log(query);
      query.query.bool = {};
      // console.log(query);
      query.query.bool.must = [];
      // console.log(query);
      query.query.bool.filter = [];
      // console.log(query);
      query.query.bool.must[0] = { term: { sessionId: body.sessionId } };
      // console.log(JSON.stringify(query));
      // query.query.bool.must[0].term = { sessionId: body.sessionId };
      query.query.bool.filter[0] = { term: { status: "notBooked" } };
      // console.log(query);
      // query.query.bool.must[0].term.sessionId = body.sessionId;
      // query.query.bool.filter[0].term.status = "notBooked";
      console.log("before query  :", query);
      // query = {
      //   sort: [
      //     {
      //       slotId: "asc",
      //     },
      //   ],
      //   query: {
      //     bool: {
      //       must: [
      //         {
      //           term: {
      //             sessionId: body.sessionId,
      //           },
      //         },
      //       ],
      //       filter: [
      //         {
      //           term: {
      //             status: "notBooked",
      //           },
      //         },
      //       ],
      //     },
      //   },
      // };
      console.log("after query");
      let res = await esUtil.search(query, index);
      console.log("1st query response   :", res);
      if (res.hits.total.value > 0) {
        slotId = res.hits.hits[0]._source.slotId;
        console.log("slotId   :", slotId);
        body.slotId = slotId;
        body.slotTime = res.hits.hits[0]._source.slotTime;
        booking = await docController.updateProfileDetailsController(
          slotId,
          index,
          body
        );
      } else {
        console.log(
          "hereeeeeeeeeeeeeeee   ",
          query.query.bool.filter[0].term.status
        );
        query.sort[0] = { slotTime: "desc" };
        console.log(query);

        query.query.bool.filter[0] = { term: { status: "booked" } };
        console.log("unReg  Query    :", query);
        //  query = {
        //   sort: [
        //     {
        //       slotId: asc,
        //     },
        //   ],
        //   query: {
        //     bool: {
        //       must: [
        //         {
        //           term: {
        //             sessionId: body.sessionId,
        //           },
        //         },
        //       ],
        //       filter: [
        //         {
        //           term: {
        //             status: notBooked,
        //           },
        //         },
        //       ],
        //     },
        //   },
        // };
        let resForUnRegUser = await esUtil.search(query, index);
        // let slotTime = resForUnRegUser.hits.hits[0]._source.slotTime;
        console.log("unreg  response  :", resForUnRegUser);
        let slotDate = resForUnRegUser.hits.hits[0]._source.appointmentDate;
        console.log(slotDate);
        let year = slotDate.toString().substring(0, 4);
        console.log(year);
        let month = slotDate.toString().substring(5, 7);
        console.log(month);
        let day = slotDate.toString().substring(8);
        console.log(day);
        let hour = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(0, 2);
        console.log(hour);
        let minute = resForUnRegUser.hits.hits[0]._source.slotTime
          .toString()
          .substring(3);
        console.log(minute);
        const slotDayTime = new Date(year, month, day, hour, minute);
        console.log(
          slotDayTime,
          "minutes   :",
          slotDayTime.getMinutes(),
          "hour   :",
          slotDayTime.getHours()
        );
        slotDayTime.setMinutes(
          slotDayTime.getMinutes() + parseInt(body.duration)
        );
        console.log(
          slotDayTime,
          "minutes   :",
          slotDayTime.getMinutes(),
          "hour   :",
          slotDayTime.getHours()
        );
        let newHour = slotDayTime.getHours();
        let newMinutes = slotDayTime.getMinutes();
        let slotTime = `${newHour}:${newMinutes}`;
        console.log(slotTime);

        body.slotTime = slotTime;
        let slotId = slotTime + body.sessionId;
        body.slotId = slotId;
        console.log(body);
        booking = await esUtil.insert(body, slotId, index);
      }
    }

    return booking;
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in creating Review",
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
    7;
    console.log(Object.keys(body.search));

    if (Object.keys(body.search).length > 0) {
      params.boolTermQuery = true;
      params.fieldName = Object.keys(body.search)[0];
      params.fieldValue = Object.values(body.search)[0];
      if (Object.keys(body.search)[0] == "doctorId") {
        params.doctorAggregation = true;
      } else if (Object.keys(body.search)[0] == "sessionId") {
        params.sessionIdAggregation = true;
        // params.sessionIdAggregationComma = true;
      } else if (Object.keys(body.search)[0] == "appointmentDate") {
        params.appointmentDateAggregation = true;
        // params.appointmentDateAggregationComma = true;
      } else if (Object.keys(body.search)[0] == "userId") {
        params.userIdAggregation = true;
        // params.userIdAggregationComma = true;
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
    // temporay code starts
    // (params.averageRatingAggregation = true),
    //   (params.averageRatingAggregationComma = true),
    //   (params.languagesAggregation = true),
    //   (params.languagesAggregationComma = true),
    //   (params.specializationAggregation = true),
    //   (params.specializationAggregationComma = true),
    //   (params.cityAggregation = true),
    //   (params.cityAggregationComma = true),
    //   (params.countryAggregation = true),
    //   (params.countryAggregationComma = true),
    //   (params.yearsOfExperienceAggregation = true),
    //   (params.yearsOfExperienceAggregationComma = true);
    // params.genderAggregation = true;

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
    console.log("params  : ", params);

    let dataOb = await esUtil.templateSearch(params, esIndex, esTemplate);
    console.log("dataOb  :", dataOb);
    output.hits = dataOb.hits.total.value;
    let searchAggs = dataOb["aggregations"]["TotalAggs"];
    // let searchFilterAggs = aggsFunc.aggegrationsData(searchAggs);
    output.result = dataOb.hits.hits.map((e) => {
      return e._source;
    }); //.map ,.filter ,.reduce
    // output.filters = searchFilterAggs;
    output.filters = searchAggs;

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
