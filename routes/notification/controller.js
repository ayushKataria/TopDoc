const uuid = require("uuid");
const socketNotif = require("./notificationType/socket");
const mailNotif = require("./notificationType/mail");
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
      if (body.medium.includes("app")) {
        let userId = [];
        for (let i = 0; i < ids.length; i++) {
          userId.push(ids[i].id);
        }
        await socketNotif.userAnnouncement(userId, body.message);
      }
      // if (body.medium.includes("sms")) {
      // let data = [];
      // for (let i = 0; i < ids.length; i++) {
      //   data.push(ids[i].mobile, ids[i].name);
      // }
      // console.log("mobile and name", data);
      // await socketNotif.userAnnouncementBySms(data, body.message);
      // }
      if (body.medium.includes("mail")) {
        let data = [];
        for (let i = 0; i < ids.length; i++) {
          data.push(ids[i].email, ids[i].name);
        }
        console.log("email and name", data);
        await mailNotif.userAnnouncementByMail(data, body.message);
      }

      console.log("notification delivered");
      for (let i = 0; i < ids.length; i++) {
        // console.log("key", key);
        const newId = uuid.v1();
        // console.log("newId", newId);
        body.notificationId = newId;
        // console.log("body[notificationId]", body.notificationId);
        body.id = ids[i].id;
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
      }
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
