const socket = io.connect('https://marinence.herokuapp.com/');

let cracks = [];
let players = [];
var colorArray = [];
var points = 0;
var c1,c2;


socket.on("intervalUpdateScore", updateScore);
socket.on("setColorOptions", setColorOptions);
socket.on("intervalUpdatePlayer", updatePlayers);
socket.on("intervalUpdateCrack", updateCrack);
socket.on("deleteConnection", removePlayer);
socket.on("removeCrack", removeCrack);


function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Passion One");
  textSize(20);
  c1 = color("#85d4f1");
  c2 = color("#2181bc");
}


function draw() {
  setGradient(c1,c2);

  fill("#ffffff");
  text("Score: "+ points, windowWidth/2, windowHeight/2);
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

function setGradient(c1,c2){
  noFill();
  for (var y=0;y<height; y++){
    var inter = map(y,0,height,0,1);
    var c = lerpColor(c1,c2,inter);
    stroke(c);
    line(0,y,width,y);
  }
}

function updateScore(score) {
  points = score;
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
        if (cracks[j].clicked()) {
        if (cracks[j].getRainbow()){
          let xPos = cracks[j].x;
          let yPos = cracks[j].y;
          socket.emit("clickRainbowCrack", xPos, yPos);
          console.log("rainbow was clicked at pos: " + xPos, yPos);
        } else if (cracks[j].getColor() == players[i].getColor()) {
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
