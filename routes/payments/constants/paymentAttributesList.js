const paymentAttributes = [
  "paymentType",
  "couponApplied",
  "doctorId",
  "userId",
  "userName",
  "slotType",
  "sessionId",
  "orderId",
  "amount",
  "status",
  "dateAndTime",
  "bookingTimeStamp",
  "userType",
  "gender",
  "email",
  "reasonForVisit",
  "appointmentType",
  "mobile",
  "doctorName",
  "paymentStatus",
  "pageNo",
  "pageSize",
];

const paymentUpdateAttributes = [
  "paymentType",
  "couponApplied",
  "doctorId",
  "userId",
  "userName",
  "orderId",
  "amount",
  "dateAndTime",
  "slotType",
  "paymentStatus",
  "pageNo",
  "pageSize",
];

const paymentSortList = ["dateAndTime", "amount"];
const paymentSearchList = [
  "paymentType",
  "couponApplied",
  "doctorId",
  "userId",
  "userName",
  "orderId",
  "amount",
  "paymentStatus",
  "role",
  "sortBy",
  "numberOfDocumentsToPick",
];

module.exports = {
  paymentAttributes,
  paymentSortList,
  paymentSearchList,
  paymentUpdateAttributes
};
