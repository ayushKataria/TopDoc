const bookingAttributes = [
  "doctorId",
  "clinicDetails",
  "clinicId",
  "sessionId",
  "slotId",
  "reasonForVisit",
  "appointmentType",
  "appointmentId",
  "slotTime",
  "slotDay",
  "userId",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "slotType",
  "userType",
  "predictedSlotTime",
  "endTime",
  "pin",
  "status",
  "dob",
  "gender",
  "userName",
  "paymentStatus",
  "email",
  "mobile",
  "timeGap",
  "doctorName",
];

const bookingUpdateAttributes = [
  "doctorId",
  "status",
  "id",
  "role",
  "clinicDetails",
  "sessionId",
  "slotId",
  "userId",
  "reasonForVisit",
  "appointmentType",
  "slotTime",
  "symptoms",
  "tests",
  "diagnosis",
  "slotDay",
  "bookingTimeStamp",
  "appointmentDate",
  "sessionStartTime",
  "sessionEndTime",
  "nextApptDate",
  "slotType",
  "clinicId",
  "medicine",
  "predictedSlotTime",
  "actualEndTime",
  "endTime",
  "pin",
  "dob",
  "gender",
  "userName",
  "paymentStatus",
  "email",
  "mobile",
  "doctorName",
  "status",
  "appointmentId"
];

const searchInBooking = ["filters", "sort", "search", "pageNo", "pageSize"];
const cancelDoctorSession = ["doctorId", "sessionId", "status"];

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
  "range",
  "predictedSlotTime",
  "actualEndTime",
  "endTime",
  "pin",
  "dob",
  "gender",
  "userName",
  "paymentStatus",
  "email",
  "mobile",
  "doctorName",
  "slotsCount",
];
const cancelBooking = [
  "status",
  "doctorId",
  "sessionId",
  "slotTime",
  "predictedSlotTime",
  "appointmentDate",
  "slotType",
  "sessionStartTime",
  "sessionEndTime",
  "clinicId",
  "clinicDetails",
  "prioritySlotId",
  "paymentStatus",
  "slotDay",
  "slotId",
  "endTime",
  "slotDuration",
  "appointmentId",
  "doctorName",
  "appointmentType",
  "userId",
  "userName",
  "mobile",
  "email",
  "gender",
  "dob",
  "pin",
  "queueId",
  "userType",
  "nextApptDate",
  "bookingTimeStamp",
  "diagnosis",
  "symptoms",
  "tests",
  "medicine",
  "reasonForVisit",
  "timeGap",
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
  "pin",
  "dob",
  "gender",
  "bool",
  "userName",
  "paymentStatus",
  "email",
  "mobile",
  "doctorName",
  "slotsCount",
];

const unRegBookingAttributes = [
  "doctorId",
  "clinicDetails",
  "clinicId",
  "sessionId",
  "reasonForVisit",
  "appointmentType",
  "diagnosis",
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
  "predictedSlotTime",
  "endTime",
  "pin",
  "status",
  "dob",
  "gender",
  "paymentStatus",
  "email",
  "doctorName",
];

const sortAttributes = [
  "slotTime",
  "bookingTimeStamp",
  "slotId",
  "sessionStartTime",
  "sessionEndTime",
  "appointmentDate",
  "predictedSlotTime",
  "actualEndTime",
  "endTime",
  "dob",
  "gender",
  "paymentStatus",
  "email",
  "mobile",
  "doctorName",
  "slotsCount",
];
const sessionDelayAttributes = [
  "doctorId",
  "sessionDelayDuration",
  "sessionId",
  "sessionDate",
  "message",
];
const weekday = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const queueAttributes = ["sessionId", "lastEndedTime"];
const changeBookingStatus = [
  "status",
  "currSessionStartTime",
  "currSessionEndTime",
  "currSessionId",
  "totalSlots",
  "completedSlots",
  "nextSessionStartTime",
  "nextSessionId",
  "timeStamp",
  "slotId",
  "appointmentDate",
  "doctorId",
  "userId",
  "reqFrom",
];

const queueStatuses = [
  "notBooked",
  "booked",
  "cancelled",
  "pinGenerated",
  "started",
  "skipped",
  "rejoined",
  "upNext",
  "paused",
  "ended",
];

module.exports = {
  bookingAttributes,
  bookingUpdateAttributes,
  searchInBooking,
  sortAttributes,
  filterAttributes,
  searchAttributes,
  unRegBookingAttributes,
  sessionDelayAttributes,
  weekday,
  queueAttributes,
  cancelDoctorSession,
  changeBookingStatus,
  cancelBooking,
};
