const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require("./utils/messages");

// set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "ChatCord Bot";

// run when a client connects
io.on("connection", (socket) => {
  // welcome current user
  socket.emit("message", formatMessage(botName, "Welcome to ChatCord!"));

  // broadcast when a user connects
  socket.broadcast.emit(
    "message",
    formatMessage(botName, "A user has joined the chat")
  );

  // runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(botName, "A user has left the chat."));
  });

  // listen for chat message
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
