const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const path = require("path");
const app = express();
const server = http.createServer(app);
const io = socketio(server);

// set static folder
app.use(express.static(path.join(__dirname, "public")));

// run when a client connects
io.on("connection", (socket) => {
  console.log("new web socket connection.");

  socket.emit("message", "Welcome to ChatCord!");
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
