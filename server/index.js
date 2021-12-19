const express = require("express");
const socketio = require("socket.io");
const http = require("http");

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
  getUsers,
} = require("./helper/users");

const PORT = process.env.PORT || 5000;

const router = require("./router");

const app = express();
const server = http.createServer(app);
// const server = http.createServer(app);
const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("join", ({ username, room }, callback) => {
    const { err, user } = addUser({ id: socket.id, username, room });

    if (err) return callback({ err });

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to the room ${user.room}`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });
    socket.join(user.room);

    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });
  });

  socket.on("sendMessage", (message, callback) => {
    const user = getUser(socket.id);

    if (!user) {
      const errorMessage =
        "You are trying to connect to two chat rooms using one user, please always use one chat room for each user";
      return callback(errorMessage);
    }

    const today = new Date();
    const currentTime = today.getHours() + ":" + today.getMinutes();

    io.to(user.room).emit("message", {
      user: user.name,
      text: message,
      timeStamp: currentTime,
    });
    io.to(user.room).emit("roomData", {
      room: user.room,
      users: getUsersInRoom(user.room),
    });

    callback();
  });

  socket.on("disconnected", () => {
    const user = removeUser(socket.id);

    socket.disconnect();
    if (user)
      io.to(user.room).emit("message", {
        user: "admin",
        text: `${user.name} has left room`,
      });
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
