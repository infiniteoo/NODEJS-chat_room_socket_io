const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// run when a client connects
io.on("connection", (socket) => {
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    console.log("logging user: ", user);
    socket.join(user.room);

    // welcome current user
    socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

    // broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(botName, `${user.username} has joined the chat`)
      );
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });

  // runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} has left the chat.`)
      );
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
