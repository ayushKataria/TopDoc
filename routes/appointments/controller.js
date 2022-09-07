'use strict'
const esUtil = require("../../utils/es_util")
const uuid = require("uuid")

async function bookAppointment(patientId, reqBody) {
    try {
        if (!reqBody.hasOwnProperty('doctorId')) {
            throw { statuscode: 400, message: "doctorId is mandatory" }
        }else if (!reqBody.hasOwnProperty('address')) {
            throw { statuscode: 400, message: "address is mandatory" }
        }else if (!reqBody.hasOwnProperty('location')) {
            throw { statuscode: 400, message: "location is mandatory" }
        }else if (!reqBody.hasOwnProperty('reasonForVisit')) {
            throw { statuscode: 400, message: "reasonForVisit is mandatory" }
        }else if (!reqBody.hasOwnProperty('type')) {
            throw { statuscode: 400, message: "type is mandatory" }
        }else if (!reqBody.hasOwnProperty('slotTime')) {
            throw { statuscode: 400, message: "slotTime is mandatory" }
        }else if (!reqBody.hasOwnProperty('slotDay')) {
            throw { statuscode: 400, message: "slotDay is mandatory" }
        }else if (!reqBody.hasOwnProperty('appointmentTime')) {
            throw { statuscode: 400, message: "appointmentTime is mandatory" }
        }
        reqBody['patientId'] = patientId
        reqBody['appointmentId'] = uuid.v4()
        reqBody['status'] = "Booked"
        reqBody['appointmentNumber'] = await getAppointmentNumber(reqBody['doctorId'], reqBody['slotTime'], reqBody['slotDay'])
        await esUtil.insert(reqBody, reqBody['appointmentId'], "schedule")
        return reqBody
    } catch (err) {
        console.log(err.stack)
        if(err.hasOwnProperty("statuscode")) {
            throw err
        }else {
            throw { statuscode: 500, message: "Unexpected error occured", err: err.message }
        }
        
    }
}

async function getSchedule(doctorId) {
    try {
        let res = await esUtil.getById("doctor", doctorId)
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
        let slots = {}
        for (const [key, value] of Object.entries(res['_source']['schedule'])) {
            slots[key] = {
                session1_slots: [],
                session2_slots: []
            }
            if (value['session1_start_time'] && value['session1_start_time'] != "") {
                slots[key]["session1_slots"] = createHalfHourIntervals(value['session1_start_time'], value['session1_end_time']).map(formatDateHHcolonMM)
            }
            if (value['session2_start_time'] && value['session2_start_time'] != "") {
                slots[key]["session2_slots"] = createHalfHourIntervals(value['session2_start_time'], value['session2_end_time']).map(formatDateHHcolonMM)
            }
        }
        return {
            totalSlots: slots
        }
    } catch (err) {
        throw { statuscode: 500, message: "Unexpected error occured", err: err.message }
    }
}

async function getAppointmentNumber(doctorId, slotTime, slotDay) {
    let query = {
        "size": 1,
        "_source": ["appointmentNumber"],
        "sort": {
            "appointmentNumber": "desc"
        },
        "query": {
            "bool": {
                "filter": [
                    {
                        "term": {
                            "doctorId": doctorId
                        }
                    },
                    {
                        "term": {
                            "slotTime": slotTime
                        }
                    },
                    {
                        "term": {
                            "slotDay": slotDay
                        }
                    }
                ]
            }
        }
    }
    let res = await esUtil.search(query, "schedule")
    if (res['hits']['total']['value'] > 0) {
        return res['hits']['hits'][0]['_source']['appointmentNumber'] + 1
    }else {
        return 1
    }
}

function createHalfHourIntervals(from, until) {
    //"01/01/2001" is just an arbitrary date
    until = Date.parse("01/01/2001 " + until)
    from = Date.parse("01/01/2001 " + from)
    //*2 because because we want every 30 minutes instead of every hour
    let max = (Math.abs(until - from) / (60 * 60 * 1000)) * 2
    let time = new Date(from)
    let intervals = []
    for (let i = 0; i <= max; i++) {
        intervals.push(time)
        time = new Date(time.getTime() + 30*60000)
    }
    return intervals
}

function formatDateHHcolonMM(date) {  // funny name but specific
    var hour = date.getHours()
    var minute = date.getMinutes()
    return hour.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false}) + ":" + minute.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})
}

module.exports = {
    getSchedule,
    bookAppointment
}