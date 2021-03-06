const express = require("express");
const socket = require('socket.io');


let Player = require("./Player");
let Crack = require("./Crack");


const app = express();
var port = process.env.PORT || 3000;
let server = app.listen(port);
app.use(express.static("public"));
let io = socket(server);


let highscore = 0;   //total score
let gameSpeed = 500;  //changes the cracks every 0.5 seconds
let maxCracks = 20;   //number of cracks shown at the same time
var colorArray = [    //list of possible color
  "#EC585D",
  "#F38E5F",
  "#FEE756",
  "#26A160",
  "#485D9A",
  "#8A6598"];
let cracks = [];
let players = [];


setInterval(updateGame, 16);
setInterval(updateCracks, gameSpeed);


io.on("connect", newConnection);

function newConnection(socket) {


  socket.on("disconnect", deleteConnection);
  socket.on("mousePosition", updatePosition);
  socket.on("clickCrack", removeCrack);
  socket.on("changePlayerColor", changePlayerColor);


  io.sockets.emit("setColorOptions", colorArray);
  players.push(new Player(socket.id, getRandomColor()));
  console.log("Player ID: " + socket.id + " has joined the game.");


  function deleteConnection() {
    console.log("Player ID: " + socket.id + " has left the game.");
    io.sockets.emit("deleteConnection", socket.id);
    remainingPlayers = [];
    for (let i = 0; i < players.length; i++) {
      if (players[i].getId() != socket.id) {
        remainingPlayers.push(players[i]);
      }
    }
    players = remainingPlayers;
  }

//positions of the players
  function updatePosition(mouseData) {
    for (let i = 0; i < players.length; i++) {
      if (players[i].getId() == socket.id) {
        players[i].setPosition(mouseData.xPos, mouseData.yPos);
      }
    }
  }
}


console.log("\x1b[36m\x1b[34m%s\x1b[0m", "Game Starts. Interval: " + gameSpeed + " milliseconds. Maximum cracks: " + maxCracks + ".");


function getRandomColor() {
  let randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
  return randomColor;
}


function changePlayerColor(localPlayer) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].getId() == localPlayer) {
      players[i].setColor(getRandomColor());
    }
  }
}


function createCrack() {
  cracks.push(new Crack(getRandomColor(), Math.random() >= 0.9)); //10% chance of rainbow
}


function removeCrack(xPos, yPos, rainbow) {
  if (rainbow) {
    highscore = highscore + 5;
    console.log("rb score");
  } else {
  highscore++;
  console.log("reg score");
}
  console.log("Current Score: " + highscore)
  for (let i = 0; i < cracks.length; i++) {
    if (cracks[i].x == xPos && cracks[i].y == yPos) {
      let deleteX = cracks[i].x;
      let deleteY = cracks[i].y;
      cracks.splice(i, 1);
      io.sockets.emit("removeCrack", deleteX, deleteY);
    }
  }
}





function updateCracks() {
  createCrack();
  if (cracks.length > maxCracks) {
    var crackToRemove = {
      xPos: cracks[0].x,
      yPos: cracks[0].y
    };
    cracks.splice(0, 1);
    io.sockets.emit("removeCrack", crackToRemove.xPos, crackToRemove.yPos);
  }
}


function updateGame() {
  io.sockets.emit("intervalUpdatePlayer", players);
  io.sockets.emit("intervalUpdateCrack", cracks);
  io.sockets.emit("intervalUpdateScore", highscore);
}
