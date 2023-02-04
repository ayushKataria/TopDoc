// const sessionAnnouncement = require(delaySessionByDuration);
const socketNotif = require("./notificationType/socket");

function sessionAnnouncement(doctorId, userId, message, medium) {
  if (medium.includes("socket")) {
    console.log("message", message);
    const userRoom = { userId, message };

    const msg = "Session has been delayed and notified to all the patients";
    // const doctorRoom = { doctorId, msg };

    socketNotif.userAnnouncement(userRoom);
    // doctorAnnouncement(doctorRoom);
  } else if (medium.includes("sms")) {
  }
}

module.exports = {
  sessionAnnouncement,
};
