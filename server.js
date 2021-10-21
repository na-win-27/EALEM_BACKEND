const express = require("express");
const socket = require("socket.io");
const http = require("http");
const cors = require("cors");
const { getBid, updateBid, getUser } = require("./highestBid");
const app = express();
const server = http.createServer(app);
const io = socket(server);

app.use(cors());

io.on("connect", (socket) => {
  socket.emit("message", "helloo");

  socket.on("join", (user) => {
    socket.room = user.room;
    socket.join(user.room);

    socket.emit("message", {
      user: "admin",
      text: `${user.name}, welcome to room ${user.room}.`,
    });
    socket.broadcast
      .to(user.room)
      .emit("message", { user: "admin", text: `${user.name} has joined!` });
  });

  socket.on("placeBid", (bid, callback) => {
    socket.broadcast.to(socket.room).emit("bidIncrement");
    callback();
    updateBid({ bid: bid, user: socket.id });
    var counter = 6;
    var WinnerCountdown = setInterval(function () {
      console.log(counter);
      io.sockets.emit("counter", counter);
      counter--;
      if (bid < getBid()) {
        clearInterval(WinnerCountdown);
      }

      if (counter == 0) {
        clearInterval(WinnerCountdown);
        socket.emit("won", { winner: "ME",bid: getBid() });
        socket.to(socket.room).emit("won", { winner: getUser(), bid: getBid() });
      }
    }, 1000);
  });
});
server.listen(8000, () => console.log(`Server has started.`));
