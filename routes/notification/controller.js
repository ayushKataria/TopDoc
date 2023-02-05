const uuid = require("uuid");
const esdb = require("../../utils/es_util");

async function createNotification(id, body) {
  try {
    console.log("inside createNotification controller", body);
    if (id.length > 0) {
      id.forEach(async (key) => {
        // console.log("key", key);
        const newId = uuid.v1();
        // console.log("newId", newId);
        body.notificationId = newId;
        // console.log("body[notificationId]", body.notificationId);
        body.id = key;
        console.log("The uuid is ", newId, body, "aaaaaaaaaaaaaaaaaaaaa");
        let entityCreationObj = await esdb.insert(body, newId, "notification");
        console.log("entityCreationObj", entityCreationObj);
        if (entityCreationObj.result == "created") {
          return {
            statuscode: 200,
            message: "Notification created Successfully",
            id: newId,
          };
        }
      });
    }
  } catch (error) {
    console.log("error", error);
    throw {
      statuscode: 404,
      message: "There was some error in creating notification",
    };
  }
}

module.exports = {
  createNotification,
};
