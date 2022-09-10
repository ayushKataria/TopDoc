

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
        // Fetch the schedule meta from ES for doctorId from doctor index
        // Fetch booked appointments for the doctor from schedule index
        // Form all possible slots for each day 
        // mark booked slots as isBooked True
        // send response
        // Possible response strucutre
        // {
        //     "Monday": [0800,0830,0900,0930,1500,1530,1600],
        //     "Tuesday": /...
        //     ...
        // }
        return {
            test: doctorId
        }
    }catch(err) {
        return { statuscode: 500, message: "Unexpected error occured"}
    }
}

module.exports = {
    getSchedule,
    bookAppointment
}