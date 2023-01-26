// const sessionAnnouncement = require(delaySessionByDuration);

function sessionAnnouncement(doctorId, userId, message, medium) {
  if (medium.includes("socket")) {
    const userRoom = { userId, message };
    const msg = "Session has been delayed and notified to all the patients";
    const doctorRoom = { doctorId, msg };

    userAnnouncement(userRoom);
    doctorAnnouncement(doctorRoom);
  } else if (medium.includes("sms")) {
  }
}
