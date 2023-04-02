const esdb = require("../../utils/es_util");
const uuid = require("uuid");

async function createNewSupportTicket(body) {
  try {
    const index = "support";
    const id = uuid.v4();
    body.ticketNumber = id;
    console.log("ticketNumber is ", id);

    let entityCreationObj = await esdb.insert(body, id, index);
    console.log(entityCreationObj);
    if (entityCreationObj.result == "created") {
      return {
        statuscode: 200,
        message: "Ticket created Successfully",
        id: id,
      };
    } else {
      throw error;
    }
  } catch (error) {
    console.log(error);
    throw {
      statuscode: 500,
      message: "There was some error in creating the issue Ticket",
    };
  }
}

module.exports = { createNewSupportTicket };
