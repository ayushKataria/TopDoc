const bcrypt = require("bcrypt");
const docController = require("../doctors/controller");

async function signup(request) {
  try {
    if (request.hasOwnProperty("email")) {
      const user = new User({
        email: request.body.email,
        password: bcrypt.hash(request.body.password),
      });
    }
    if (request.hasOwnProperty("phone")) {
      const user = new User({
        email: request.body.phone,
        password: request.body.password,
      });
    }
  } catch (error) {
    if (error.statuscode) {
      throw error;
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}

async function medicalDetails(body) {
  try {
    id = body.id;
    role = body.role;
    fieldsToFetch = body.fields;
    size = body.size;
    let data = await docController.getProfileDetailsController(id, role, [
      "medicalDetails",
    ]);
    data = data.results[0].medicalDetails;
    data.sort(function (a, b) {
      var dateA = new Date(a.orderDate),
        dateB = new Date(b.orderDate);
      return dateB - dateA;
    });
    let MedicalList = [];
    if (size > data.length) {
      size = data.length;
    }
    for (let i = 0; i < size; i++) {
      let fieldData = data[i][fieldsToFetch]; //hardcode value is working
      let fieldDate = data[i].orderDate;
      if (fieldData == null) {
        size = size + 1;
      } else {
        MedicalList.push({ date: fieldDate, data: fieldData });
      }
    }
    return MedicalList;
  } catch (error) {
    if (error.statuscode) {
      throw error;
    } else {
      throw {
        statuscode: 500,
        err: "internal server error",
        message: "unexpected error",
      };
    }
  }
}

module.exports = { medicalDetails };
