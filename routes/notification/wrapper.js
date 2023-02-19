// const sessionAnnouncement = require(delaySessionByDuration);
const socketNotif = require("./notificationType/socket");
const notifController = require("./controller");
const mailNotif = require("./notificationType/mail");

async function sessionAnnouncement(id, body) {
  let userId = [];
  let data = [];

  for (let i = 0; i < id.length; i++) {
    userId.push(id[i].id);
    data[i] = { email: id[i].email, name: id[i].name };
  }
  await notifController.createNotification(userId, body);
  if (body.medium.includes("app")) {
    console.log("inside session announcement, send by app");
    await socketNotif.userAnnouncement(userId, body.message);
  }
  if (body.medium.includes("mail")) {
    await mailNotif.userAnnouncementByMail(data, body.message);
  }
  // if (body.medium.includes("sms")) {
  // }
}

module.exports = {
  sessionAnnouncement,
};
