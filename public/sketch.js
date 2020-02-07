const socket = io.connect('https://marinence.herokuapp.com/');

let cracks = [];
let players = [];
var colorArray = [];



socket.on("setColorOptions", setColorOptions);
socket.on("intervalUpdatePlayer", updatePlayers);
socket.on("intervalUpdateCrack", updateCrack);
socket.on("deleteConnection", removePlayer);
socket.on("removeCrack", removeCrack);


function setup() {
  createCanvas(windowWidth, windowHeight);
}


function draw() {
  background(220);
  for (let i = 0; i < cracks.length; i++) {
    cracks[i].draw();
    if (cracks[i].getRainbow()) {
      cracks[i].setColor(getRandomColor());
    }
  }
  for (let i = 0; i < players.length; i++) {
    players[i].draw();
  }
}


function getRandomColor() {
  let randomColor = colorArray[Math.floor(Math.random() * colorArray.length)];
  return randomColor;
}

function setColorOptions(colorOptions) {
  colorArray = colorOptions;
}


function mouseMoved() {
  var mouseData = {
    xPos: mouseX,
    yPos: mouseY
  }
  socket.emit("mousePosition", mouseData);
}


function mouseReleased() {
  for (let i = 0; i < players.length; i++) {
    if (players[i].getId() == socket.id) {
      for (let j = 0; j < cracks.length; j++) {
        if (cracks[j].getRainbow()){
          for (let k=0; k <players.length; k++){
            if (players[k].intersect(players[k].x, players[k].y)){
              console.log('oi tim');
            }
          }
        }
        if (cracks[j].clicked()) {
          if (cracks[j].getColor() == players[i].getColor()) {
            let xPos = cracks[j].x;
            let yPos = cracks[j].y;
            let localPlayer = socket.id
            socket.emit("clickCrack", xPos, yPos);
            socket.emit("changePlayerColor", localPlayer);
          }
        }
      }
    }
  }
}


function updateCrack(serverCracks) {
  for (let i = 0; i < serverCracks.length; i++) {
    let crackFromServer = serverCracks[i];
    if (!crackExists(crackFromServer)) {
      cracks.push(new Crack(crackFromServer));
    }
  }
}


function crackExists(crackFromServer) {
  for (let i = 0; i < cracks.length; i++) {
    if (cracks[i].x == crackFromServer.x && cracks[i].y == crackFromServer.y) {
      return true;
    }
  }
  return false;
}


function removeCrack(xPos, yPos) {
  for (let i = 0; i < cracks.length; i++) {
    if (cracks[i].x == xPos && cracks[i].y == yPos) {
      cracks.splice(i, 1);
    }
  }
}


function updatePlayers(serverPlayers) {
  for (let i = 0; i < serverPlayers.length; i++) {
    let playerFromServer = serverPlayers[i];
    if (!playerExists(playerFromServer)) {
      players.push(new Player(playerFromServer));
      console.log("Player ID: " + socket.id + " has joined the game.");
    } else {
      players[i].update(playerFromServer);
    }
  }
}


function playerExists(playerFromServer) {
  for (let i = 0; i < players.length; i++) {
    if (players[i].getId() == playerFromServer.id) {
      return true;
    }
  }
  return false;
}


function removePlayer(playerId) {
  let remainingPlayers = [];
  for (let i = 0; i < players.length; i++) {
    if (players[i].getId() != playerId) {
      remainingPlayers.push(players[i]);
    }
  }
  players = remainingPlayers;
}
