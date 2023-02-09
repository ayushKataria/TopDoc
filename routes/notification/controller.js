const uuid = require("uuid");
const socketNotif = require("./notificationType/socket");
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

async function manualNotification(body) {
  try {
    console.log("inside manualNotification controller", body);
    if (body.id.length > 0) {
      let ids = body.id;
      if (req.body.medium.includes("app")) {
        await socketNotif.userAnnouncement(ids, body.message);
      } else if (req.medium.includes("sms")) {
        // socketNotif.userAnnouncement(id, body.message);
      } else {
        // socketNotif.userAnnouncement(id, body.message);
      }

      console.log("notification delivered");
      ids.forEach(async (key) => {
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
  manualNotification,
};
