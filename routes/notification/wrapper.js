// const sessionAnnouncement = require(delaySessionByDuration);
const socketNotif = require("./notificationType/socket");
const notifController = require("./controller");

async function sessionAnnouncement(id, body) {
  await notifController.createNotification(id, body);
  if (body.medium.includes("app")) {
    socketNotif.userAnnouncement(id, body.message);
  }
  // if (medium.includes("mail")) {
  // }
  // if (medium.includes("sms")) {
  // }
}

module.exports = {
  sessionAnnouncement,
};
