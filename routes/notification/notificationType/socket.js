const io = require("socket.io")(http);

// session = { userId, doctorId };

export function userAnnouncement(room) {
  io.on("connection", (socket) => {
    // const room = socket.handshake.session;

    // Extract doctor and user data from session
    const userArr = room.userId;
    console.log(user);
    socket.broadcast
      .to(userArr)
      .emit("notification", { message: room.message });

    // Notify all users associated with doctor
    // io.sockets.in(doctor).emit("notification", { message: session.message });
  });
}
