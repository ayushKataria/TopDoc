const socketio = require("socket.io");
const server = 4000;
const io = socketio(server);

let usersId = [];

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("register", (userId) => {
    console.log("inside register", userId);
    usersId.push({ [userId]: socket.id });
    // usersId.push(userId);
  });
});
function userAnnouncement(userIdList, duration) {
  console.log("Send message called", userIdList);
  let patient = [];
  console.log("usersid", usersId);
  let keyarr = usersId.map((obj) => Object.keys(obj)[0]);
  console.log(keyarr, "keyarr", userIdList);
  patient = userIdList.filter((element) => keyarr.includes(element.toString()));
  console.log("patient", patient);
  patient.forEach((user) => {
    io.to(usersId.map((obj) => obj[user])).emit("notification", {
      message: `We regret to inform that, doctor has delayed the session by ${duration} minutes`,
    });
  });
}

module.exports = {
  userAnnouncement,
};
