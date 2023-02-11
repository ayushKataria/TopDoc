const adsAttributes = [
  "banner",
  "templateId",
  "adId",
  "doctorId",
  "submittedBy",
  "targetDistrict",
  "targetState",
  "duration",
  "approvedBy",
  "startDate",
  "status",
  "endDate",
  "billing",
  "clicks",
  "appearances",
  "sort",
  "filters",
  "pageNo",
  "pageSize",
  "role",
  "sortBy",
];

const adsSortList = ["startDate", "endDate"];
const adsFilterList = ["status", "targetDistrict", "targetState"];
const adsShowToUserAttributes = [
  "pageNo",
  "pageSize",
  "district",
  "state",
  "userId",
];
const searchRequestConst = [
  "role",
  "sortBy",
  "numberOfDocumentsToPick",
  "filter",
];

module.exports = {
  adsAttributes,
  adsSortList,
  adsFilterList,
  adsShowToUserAttributes,
  searchRequestConst,
};
