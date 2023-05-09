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
async function userAnnouncement(userIdList, body) {
  console.log("Send message called", userIdList);
  try {
    let patient = [];
    console.log("usersid inside socket", usersId);
    let keyarr = usersId.map((obj) => Object.keys(obj)[0]);
    console.log(keyarr, "keyarr", userIdList);
    patient = userIdList.filter((element) =>
      keyarr.includes(element.toString())
    );
    console.log("patient", patient);

    if (body.tag.includes("QueueReload")) {
      console.log("Queue reloaded");
      patient.forEach((user) => {
        io.to(usersId.map((obj) => obj[user])).emit("QueueReload", {
          message: body.message,
          id: user,
        });
      });
    }
    if (body.tag.includes("CancelBooking")) {
      console.log("CancelBooking triggered");
      patient.forEach((user) => {
        io.to(usersId.map((obj) => obj[user])).emit("CancelBooking", {
          message: body.message,
          id: user,
        });
      });
    } else {
      patient.forEach((user) => {
        io.to(usersId.map((obj) => obj[user])).emit("notification", {
          message: body.message,
          time: body.time,
        });
      });
    }
  } catch (err) {
    console.log("Error caught is ", err);
  }
}

module.exports = {
  userAnnouncement,
};
