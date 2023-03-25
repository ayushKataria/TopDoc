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
function userAnnouncement(userIdList, body) {
  console.log("Send message called", userIdList);
  let patient = [];
  console.log("usersid", usersId);
  let keyarr = usersId.map((obj) => Object.keys(obj)[0]);
  console.log(keyarr, "keyarr", userIdList);
  patient = userIdList.filter((element) => keyarr.includes(element.toString()));
  console.log("patient", patient);
  if (body.tag.includes("QueueReload")) {
    patient.forEach((user) => {
      io.to(usersId.map((obj) => obj[user])).emit("QueueReload", {
        message: body.message,
      });
    });
  } else {
    patient.forEach((user) => {
      io.to(usersId.map((obj) => obj[user])).emit("notification", {
        message: body.message,
      });
    });
  }
}

module.exports = {
  userAnnouncement,
};
