const socket = io.connect('https://marinence.herokuapp.com/');

let cracks = [];
let players = [];
var colorArray = [];
var points = 0;
var c1,c2;
var bubbles = [];
var bgleft;
var bgright;

socket.on("intervalUpdateScore", updateScore);
socket.on("setColorOptions", setColorOptions);
socket.on("intervalUpdatePlayer", updatePlayers);
socket.on("intervalUpdateCrack", updateCrack);
socket.on("deleteConnection", removePlayer);
socket.on("removeCrack", removeCrack);

function preload() {

  bgleft = loadImage("./assets/coral_left.png");
  bgright = loadImage("./assets/coral_right.png");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Passion One");
  textSize(30);
  c1 = color("#85d4f1");
  c2 = color("#2181bc");

  for (var t = 0; t < 200; t++) {
  bubbles[t] = new Bubble();
}

}


function draw() {
  setGradient(c1,c2);

image(bgleft, 0.1, height*0.5, width/2, height/2);
image(bgright, width/2, height/2, width/2, height/2);
push();
noStroke();
fill(255, 70);
rect(0,0,windowWidth,windowHeight);
pop();


  for (var t = 0; t < bubbles.length; t++) {
    bubbles[t].move();
    bubbles[t].display();
  }

  fill("#ffffff");
  text("Score: "+ points, windowWidth-150, windowHeight-50);
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
      let localPlayer = socket.id
      for (let j = 0; j < cracks.length; j++) {
        if (cracks[j].clicked()) {
          let xPos = cracks[j].x;
          let yPos = cracks[j].y;
        if (cracks[j].getRainbow()){
          if (allIntersect(cracks[j])){
            socket.emit("clickCrack", xPos, yPos);
            socket.emit("changePlayerColor", localPlayer);
          }
        } else if (cracks[j].getColor() == players[i].getColor()) {
            socket.emit("clickCrack", xPos, yPos);
            socket.emit("changePlayerColor", localPlayer);
          }
        }
      }
    }
  }
}

function allIntersect(crack) {
  let playersIntersect = 0;
  for (let i = 0; i < players.length; i++) {
    if (players[i].x > crack.x && players[i].x < crack.x + crack.width && players[i].y > crack.y && players[i].y < crack.y + crack.height) {
          playersIntersect++;
        }

  if (playersIntersect == players.length) {

    console.log(playersIntersect);
    console.log(players.length);
    return true;
  } else {

    console.log(playersIntersect);
    console.log(players.length);
    return false;
  }

}
}

function Bubble() {
  this.x = random(0, windowWidth);
  this.y = random(0, windowHeight);
  this.size = 15 * random();
  this.speed = 1;

  var xIncrease = 0.2;
  var yIncrease = -2;

  //movement
  this.move = function() {
    this.x += xIncrease * random(-4, 4);
    this.y += yIncrease * this.speed + random(-1, 1);

    if (this.y < 0) {
      this.y = windowHeight;
    }
  }

  //appearence
  this.display = function() {
    fill('rgba(255,255,255, 0.4)')
    noStroke();
    ellipse(this.x, this.y, this.size)
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

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
