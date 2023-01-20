const bookingAttributes = [
  "doctorId",
  "clinicDetails",
  "clinicId",
  "sessionId",
  "slotId",
  "reasonForVisit",
  "appointmentType",
  "slotTime",
  "slotDay",
  "userId",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "slotType",
  "userType",
];

const bookingUpdateAttributes = [
  "doctorId",
  "status",
  "id",
  "role",
  "clinicDetails",
  "sessionId",
  "slotId",
  "reasonForVisit",
  "appointmentType",
  "slotTime",
  "slotDay",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "slotType",
  "clinicId",
];

const searchInBooking = ["filters", "sort", "search", "pageNo", "pageSize"];

const searchAttributes = [
  "doctorId",
  "status",
  "userId",
  "appointmentId",
  "clinicDetails",
  "sessionId",
  "slotId",
  "reasonForVisit",
  "appointmentType",
  "slotTime",
  "slotDay",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "slotType",
  "userType",
  "clinicId",
];

const filterAttributes = [
  "doctorId",
  "status",
  "userId",
  "sessionId",
  "appointmentType",
  "slotDay",
  "appointmentDate",
  "slotType",
  "clinicDetails",
  "userType",
  "clinicId",
];

const unRegBookingAttributes = [
  "doctorId",
  "clinicDetails",
  "clinicId",
  "sessionId",
  "reasonForVisit",
  "appointmentType",
  "slotDay",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "slotType",
  "userType",
  "duration",
  "mobile",
  "userName",
];

const sortAttributes = [
  "slotTime",
  "bookingTimeStamp",
  "slotId",
  "sessionStartTime",
  "sessionEndTime",
  "appointmentDate",
];

module.exports = {
  bookingAttributes,
  bookingUpdateAttributes,
  searchInBooking,
  sortAttributes,
  filterAttributes,
  searchAttributes,
  unRegBookingAttributes,
};
