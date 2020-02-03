// load express library
var express = require('express');
// create the app
var app = express();

let Player = require("./Player");
// define the port where client files will be provided
var port = process.env.PORT || 3000;
// start to listen to that port
var server = app.listen(port);
// provide static access to the files
// in the "public" folder
app.use(express.static('public'));
// load socket library
var socket = require('socket.io');
// create a socket connection
var io = socket(server);
// define which function should be called
// when a new connection is opened from client
io.on('connection', newConnection);
// callback function: the paramenter (in this case socket)
// will contain all the information on the new connection
function newConnection(socket) {
  //when a new connection is created, print its id
  console.log('socket:', socket.id);
  //define what to do on different kind of messages
  socket.on('newCrack', newCrack);
  socket.on('deleteCrack', eraseCrack);
  socket.on('sendPosition', sendPosition);
	//reaction on messages
  function newCrack(crackData) {
    socket.broadcast.emit('crackBroadcast', crackData);
    console.log(crackData);
  }
  function eraseCrack(deleteId) {
    socket.broadcast.emit('deleteBroadcast', deleteId);
    console.log(deleteId);
  }
  function sendPosition(localPlayer) {
    socket.broadcast.emit('receivePosition', localPlayer);
    console.log(localPlayer);
  }
}
console.log('node server is running')

let io = socket(server);

let players = [];

setInterval(updateGame, 16);

io.sockets.on("connection", socket => {
  console.log(`New connection ${socket.id}`);
  players.push(new Player(socket.id));

  socket.on("disconnect", () => {
    io.sockets.emit("disconnect", socket.id);
    players = players.filter(player => player.id !== socket.id);
  });
});


io.sockets.on("disconnect", socket => {
  io.sockets.emit("disconnect", socket.id);

  players = players.filter(player.id !== socket.id);
});



function updateGame() {
  io.sockets.emit("heartbeat", players);
}
