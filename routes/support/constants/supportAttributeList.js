const supportAttributes = [
  "ticketNumber",
  "role",
  "reporterID",
  "priority",
  "fullName",
  "email",
  "mobile",
  "subject",
  "description",
  "supportingDocuments",
  "raisedOn",
  "resolvedOn",
  "assignedTo",
  "remarks",
  "status",
  "escalatedTo",
  "escalationRemark",
  "chat",
];

const updateSupportAttributes = [
  "id",
  "priority",
  "role",
  "supportingDocuments",
  "resolvedOn",
  "assignedTo",
  "remarks",
  "status",
  "escalatedTo",
  "escalationRemark",
  "chat",
];

const createNewSupportAttributes = [
  "role",
  "reporterID",
  "priority",
  "fullName",
  "email",
  "mobile",
  "subject",
  "description",
  "supportingDocuments",
  "raisedOn",
  "status",
];

module.exports = {
  supportAttributes,
  createNewSupportAttributes,
  updateSupportAttributes,
};
