var socket;
let localPlayerId;
let localPlayer;
let allPlayers = [];
let myMirrorPlayer = [];
let playerNumber = 0;
let totalPlayers = 0;
let firstPlayerId;
let crackId = 0;
let myCrack = [];
let myCrackMirrored = [];
let maxCracks = 6;
let crackWidth = 100;
let crackHeight = 100;
let crackLifetime = 400; //in seconds

let colorOption = [];
let crackColorOption = [];
let patchColorOption = [];

let yourScore = 0;
let TotalScore = 0;

function preload() {
  // put preload code here
  for (i = 0; i < 6; i++) {
    colorOption[i] = i;
  }
  for (i = 0; i < 6; i++) {
    crackColorOption[i] = loadImage("./assets/crack_" + i + ".png");
  }
  for (i = 0; i < 6; i++) {
    patchColorOption[i] = loadImage("./assets/patch_" + i + ".png");
  }
}

function setup() {
  createCanvas(windowWidth, (windowHeight - 10));

  socket = io();
  socket = io.connect('https://marinence.herokuapp.com/');

  socket.on('crackBroadcast', mirrorCreateCrack);
  socket.on('deleteBroadcast', mirrorDeleteCrack);
  socket.on('receivePosition', updatePlayer);
  socket.on('updateTotal', function updateTotalScore(val){
    TotalScore=val;
    printScore();
  });

  createPlayer();
  for (i = 0; i < maxCracks; i++) {
    createCrack();
  }
}
function draw() {
  // put drawing code here
  background(2, 24, 89);

  for (i = 0; i < myCrack.length; i++) {
    if (myCrack[i].getFixed()) {
      deleteCrack(i);
    }
    myCrack[i].display();
    myCrack[i].update();
  }

  for (i = 0; i < allPlayers.length; i++) {
    if (allPlayers[i].getId() == localPlayerId) {
      allPlayers[i].setPosition(mouseX, mouseY);
      allPlayers[i].display();
      let p = { id: allPlayers[i].getId(), x: allPlayers[i].x, y: allPlayers[i].y, color: allPlayers[i].color };
      socket.emit("sendPosition", p);
    }
    else {
      allPlayers[i].setPosition(allPlayers[i].x, allPlayers[i].y);
      allPlayers[i].display();
    }
  }
}

function generateId() {
  let mil = millis();
  let sec = second();
  let min = minute();
  let timestamp = [mil, sec, min];
  return timestamp.join('-');
}

function createPlayer() {
  let playerColor = random(colorOption);
  let playerId = generateId();
  localPlayerId = playerId;
  var player = new Player(playerId, mouseX, mouseY, playerColor);
  console.log(player);
  allPlayers.push(player);
}
function updatePlayer(newPlayer) {


  var p = allPlayers.find(x => x.id === newPlayer.id);
  if (p) {
    p.x = newPlayer.x;
    p.y = newPlayer.y;
    p.color = newPlayer.color;
    p.setImage();
  }
  else {
    var player = new Player(newPlayer.id, newPlayer.x, newPlayer.y, newPlayer.color);
    allPlayers.push(player);
  }

}

function createCrack() {
  let lifetime = random(crackLifetime - 50, crackLifetime + 50);
  let color = random(colorOption);
  let randomX = random(50, windowWidth - 50);
  let randomY = random(50, windowHeight - 50);
  var crackData = {
    myId: crackId,
    cX: randomX,
    cY: randomY,
    cL: lifetime,
    cC: color,
  }
  socket.emit("newCrack", crackData);
  myCrack.push(new Crack(crackId, randomX, randomY, lifetime, color));
  crackId++;
  if (crackId > 8) {
    crackId = 0;
  }
}

function mirrorCreateCrack(crackData) {
  myCrack.push(new Crack(crackData.myId, crackData.cX, crackData.cY, crackData.cL, crackData.cC));

}

function deleteCrack(i) {
  var deleteId = myCrack[i].getId();
  socket.emit("deleteCrack", deleteId);
  myCrack.splice(i, 1);
  if (myCrack.length < maxCracks) {
    createCrack();
  }
}

function mirrorDeleteCrack(deleteId) {
  for (i = 0; i < myCrack.length; i++) {
    if (myCrack[i].getId() == deleteId) {
      myCrack.splice(i, 1);
    }
  }
}

function mouseReleased() {
  for (i = 0; i < myCrack.length; i++) {
    if (myCrack[i].mouseHover()) {
      myCrack[i].setFixed();
      allPlayers[0].setColor();
      updateSelfScore();
    }
  }
}

function updateSelfScore() {
    yourScore+=1;
    socket.emit("increaseScore");
  printScore();
}

function printScore() {
  document.getElementById("score").innerText = yourScore;
  document.getElementById("totalscore").innerText = TotalScore;
}
