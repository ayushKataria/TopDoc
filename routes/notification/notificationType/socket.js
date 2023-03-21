const socketio = require("socket.io");
const server = 4000;
const io = socketio(server, { cors: { origin: "*" } });

let usersId = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("register", (userId) => {
    console.log("inside register", userId);
    usersId.push({ [userId]: socket.id });
    // usersId.push(userId);
  });
});
function userAnnouncement(userIdList, notifBody) {
  console.log("Send message called", userIdList);
  let patient = [];
  console.log("usersid", usersId);
  let keyarr = usersId.map((obj) => Object.keys(obj)[0]);
  console.log(keyarr, "keyarr", userIdList);
  patient = userIdList.filter((element) => keyarr.includes(element.toString()));
  console.log("patient", patient);
  if (notifBody.tag.includes("QueueReload")) {
    patient.forEach((user) => {
      io.to(usersId.map((obj) => obj[user])).emit("QueueReload", {
        message: notifBody.message,
      });
    });
  }
  if (notifBody.tag.includes("delay")) {
    patient.forEach((user) => {
      io.to(usersId.map((obj) => obj[user])).emit("notification", {
        message: notifBody.message,
      });
    });
  }

  if (notifBody.tag.includes("cancelSession")) {
    patient.forEach((user) => {
      io.to(usersId.map((obj) => obj[user])).emit("notification", {
        message: notifBody.message,
      });
    });
  }
}

module.exports = {
  userAnnouncement,
};
