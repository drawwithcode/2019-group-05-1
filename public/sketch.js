const socket = io.connect('https://marinence.herokuapp.com/');

let cracks = [];
let players = [];
var colorArray = [];
var points = 0;
var c1, c2;
var bubbles = [];
var bgleft;
var bgright;

var fish, fish2, fish3, fish4, fish5;
var fishRev, fish2Rev, fish3Rev, fish4Rev, fish5Rev;
var fisha, fishb, fishc, fishd, fishe;

socket.on("intervalUpdateScore", updateScore);
socket.on("setColorOptions", setColorOptions);
socket.on("intervalUpdatePlayer", updatePlayers);
socket.on("intervalUpdateCrack", updateCrack);
socket.on("deleteConnection", removePlayer);
socket.on("removeCrack", removeCrack);

function preload() {

  bgleft = loadImage("./assets/coral_left.png");
  bgright = loadImage("./assets/coral_right.png");

  fish = loadImage("./gif/fish1.gif");
  fishRev = loadImage("./gif/fish1-rev.gif");
  fish2 = loadImage("./gif/fish2.gif");
  fish2Rev = loadImage("./gif/fish2-rev.gif");
  fish3 = loadImage("./gif/manta.gif");
  fish3Rev = loadImage("./gif/manta-rev.gif");
  fish4 = loadImage("./gif/turtle.gif");
  fish4Rev = loadImage("./gif/turtle-rev.gif");
  fish5 = loadImage("./gif/vaquita.gif");
  fish5Rev = loadImage("./gif/vaquita-rev.gif");

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(60);

  fisha = new fishs(fish, fishRev, 0, 1, 4, 40);
  fishb = new fishs(fish2, fish2Rev, width, -1, 5, 60);
  fishc = new fishs(fish3, fish3Rev, 0, 1, 10, 80);
  fishd = new fishs(fish4, fish4Rev, width, -1, 50, 60);
  fishe = new fishs(fish5, fish5Rev, 0, 1, 10, 80);

  textFont("Passion One");
  textSize(30);
  c1 = color("#85d4f1");
  c2 = color("#2181bc");

  for (var t = 0; t < 200; t++) {
    bubbles[t] = new Bubble();
  }

}


function draw() {
  setGradient(c1, c2);

  fisha.move();
  fishb.move();
  fishc.move();
  fishd.move();
  fishe.move();
  fisha.render();
  fishb.render();
  fishc.render();
  fishd.render();
  fishe.render();

  image(bgleft, 0.1, height * 0.5, width / 2, height / 2);
  image(bgright, width / 2, height*0.5, width / 2, height / 2);
  push();
  noStroke();
  fill(255, 70);
  rect(0, 0, windowWidth, windowHeight);
  pop();


  for (var t = 0; t < bubbles.length; t++) {
    bubbles[t].move();
    bubbles[t].display();
  }

  for (let i = 0; i < players.length; i++) {
    players[i].draw();
  }

  for (let i = 0; i < cracks.length; i++) {
    cracks[i].draw();
    if (cracks[i].getRainbow()) {
      cracks[i].setColor(getRandomColor());

    }
  }
  fill("#ffffff");
  text("Score: " + points, windowWidth - 150, windowHeight - 50);
}

function setGradient(c1, c2) {
  noFill();
  for (var y = 0; y < height; y++) {
    var inter = map(y, 0, height, 0, 1);
    var c = lerpColor(c1, c2, inter);
    stroke(c);
    line(0, y, width, y);
  }
}

function fishs(_img, _imgRev, _x, _dir, _duration, _yAmplit) {

  var y, r = random(0, 2); //random starting point
  var deltax, x, px = 0;
  this.move = function() {
    if (frameCount % (_duration * 60) == 0) {
      // _dir = -_dir; //reverse
      console.log("rev");
    }
    _x = width / 2 * (cos(frameCount * width / (_duration * 60) / (200 * PI) + r * PI) + 1); //x position speed for moving
    y = sin(frameCount * PI / 150 + r) * _yAmplit + (r + 1) / 4 * height; //y position for moving
  }
  this.render = function() {

    x = _x;
    deltax = x - px;
    console.log(deltax);
    if (deltax >= 0) {
      image(_img, _x, y); //normal direction for moving
    } else {
      image(_imgRev, _x, y); //reversed moving
    }
    px = x;
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
          if (cracks[j].getRainbow()) {
            if (allIntersect(cracks[j])) {
              socket.emit("clickCrack", xPos, yPos, true);
              socket.emit("changePlayerColor", localPlayer);
            }
          } else if (cracks[j].getColor() == players[i].getColor()) {
            socket.emit("clickCrack", xPos, yPos, false);
            socket.emit("changePlayerColor", localPlayer);
          }
        }
      }
    }
  }
}

function allIntersect(crack) {
  let playersIntersect = 0;
  for (let k = 0; k < players.length; k++) {
    if (players[k].x > crack.x && players[k].x < crack.x + crack.width && players[k].y > crack.y && players[k].y < crack.y + crack.height) {
      playersIntersect++;
    }


  }
  if (playersIntersect == players.length) {
    return true;
  } else {
    return false;
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
