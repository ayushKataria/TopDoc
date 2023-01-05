const paymentAttributes = [
  "paymentType",
  "couponApplied",
  "doctorId",
  "userId",
  "userName",
  "orderId",
  "amount",
  "dateAndTime",
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
];

module.exports = {
  paymentAttributes,
  paymentSortList,
  paymentSearchList,
};
