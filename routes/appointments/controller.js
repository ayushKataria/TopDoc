'use strict'
const esUtil = require("../../utils/es_util")

async function bookAppointment(userId, doctorId, slotStartTime) {
    try{
        return {
            test: doctorId
        }
    }catch(err) {
        return { statuscode: 500, message: "Unexpected error occured"}
    }
}

async function getSchedule(doctorId) {
    try{
        let res = await esUtil.getById("doctor", "oUx7coEBl3a7mjbwBX1y")
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
        return {
            test: res['_source']['schedule']
        }
    }catch(err) {
        console.log(err.message)
        throw { statuscode: 500, message: "Unexpected error occured"}
    }
}

module.exports = {
    getSchedule,
    bookAppointment
}