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
  "gender",
  "last_name",
  "medicalDetails",
  "blood_group",
];

const staffRegistredAttributes = ["mobile", "role", "id"];
module.exports = {
  userAttributes,
  userMedicalDetailsAttributes,
  userUpdateAttributes,
  staffRegistredAttributes,
};
