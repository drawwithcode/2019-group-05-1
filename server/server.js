const express = require("express");
const socket = require('socket.io');


let Player = require("./Player");
let Crack = require("./Crack");


const app = express();
var port = process.env.PORT || 3000;
let server = app.listen(port);
app.use(express.static("public"));
let io = socket(server);


let highschore = 0;   //total score
let gameSpeed = 200;  //changes the cracks every 0.5 seconds
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
  // socket.on("clickRainbowCrack", removeRainbowCrack);
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
  // cracks.push(new Crack(getRandomColor(), Math.random() >= 0.9)); //10% chance of rainbow
  cracks.push(new Crack(getRandomColor(), true)); //10% chance of rainbow
}


function removeCrack(xPos, yPos) {
  highschore++;
  console.log("Current Score: " + highschore)
  for (let i = 0; i < cracks.length; i++) {
    if (cracks[i].x == xPos && cracks[i].y == yPos) {
      let deleteX = cracks[i].x;
      let deleteY = cracks[i].y;
      cracks.splice(i, 1);
      io.sockets.emit("removeCrack", deleteX, deleteY);
    }
  }
}

// function removeRainbowCrack(xPos, yPos) {
//   console.log("remove RC");
//   let playersIntersect = 0;
//   for (let h = 0; h < players.length; i++) {
//
//     if (xPos > players[h].x && xPos < players[h].x + players[h].radius && yPos > players[h].y && yPos < players[h].y + players[h].radius) {
//       playersIntersect++;
//     }
//     if (playersIntersect == players.length) {
//   highschore = highscore + 5;
//   console.log("Current Score: " + highschore)
//   for (let i = 0; i < cracks.length; i++) {
//     if (cracks[i].x == xPos && cracks[i].y == yPos) {
//       let deleteX = cracks[i].x;
//       let deleteY = cracks[i].y;
//       cracks.splice(i, 1);
//       io.sockets.emit("removeCrack", deleteX, deleteY);
//     }
//     }
//   }
//   console.log("Array Length: "+ players.length);
//   console.log("Var Length: "+ playersIntersect);
// }
// }


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
  io.sockets.emit("intervalUpdateScore", highschore);
}
