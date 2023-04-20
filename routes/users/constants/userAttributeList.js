const userAttributes = [
  "bmi",
  "orderDate",
  "fbcStatus",
  "heartRate",
  "name",
  "weight",
  "id",
  "role",
  "medicalDetails",
];
const userAttributesAll = [
  "bmi",
  "orderDate",
  "fbcStatus",
  "heartRate",
  "name",
  "weight",
  "id",
  "role",
  "medicalDetails",
  "sortBy",
  "filter",
  "numberOfDocumentsToPick",
];
const userAttributesMatchSearch = ["name"];

const userMedicalDetailsAttributes = [
  "bmi",
  "orderDate",
  "fbcStatus",
  "heartRate",
  "name",
  "weight",
];

const userUpdateAttributes = [
  "id",
  "role",
  "DOB",
  "Zipcode",
  "address",
  "blood_donor",
  "city",
  "country",
  "email",
  "insurance_details",
  "landmark",
  "language",
  "locality",
  "medical_records",
  "mobile",
  "name",
  "state",
  "first_name",
  "password",
  "gender",
  "last_name",
  "medicalDetails",
  "blood_group",
];

const staffRegistredAttributes = ["mobile", "role"];
const staffUpdateAttributes = [
  "firstName",
  "lastName",
  "mobile",
  "email",
  "mappedTo",
  "education",
  "experience",
  "role",
  "pin",
  "password",
  "staffId",
  "designation",
];
module.exports = {
  userAttributes,
  staffUpdateAttributes,
  userMedicalDetailsAttributes,
  userUpdateAttributes,
  staffRegistredAttributes,
  userAttributesMatchSearch,
  userAttributesAll,
};
