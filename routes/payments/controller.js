"use strict";
const esdb = require("../../utils/es_util");

async function createNewPayment(object) {
  try {
    const newId = object.orderId;
    let entityCreationObj = await esdb.insert(object, newId, "payment");
    if (entityCreationObj.result == "created") {
      return { statuscode: 200, message: "payment recorded Successfully" };
    } else {
      throw err;
    }
  } catch (err) {
    throw {
      statuscode: 404,
      message: "There was some error in recording payment",
    };
  }
}

module.exports = {
  createNewPayment,
};
