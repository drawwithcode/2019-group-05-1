let myCrack = [];
let myCrackMirrored = [];

let myPatch;
let playerId;
let myPlayer = [];
let myMirrorPlayer = [];
let playerNumber = 0;
let totalPlayers = 0;

let crackId = 0;
let maxCracks = 6;
let crackWidth = 100;
let crackHeight = 100;
let crackLifetime = 400; //in seconds

let colorOption = [];
let crackColorOption = [];
let patchColorOption = [];

var socket;

const socket = io.connect('http://localhost');

let players = [];

socket.on("heartbeat", players => updatePlayers(players));
socket.on("disconnect", playerId => removePlayer(playerId));




function preload(){
  // put preload code here
  for (i = 0; i < 6; i++) {
    colorOption[i] = i;
  }
  for (i = 0; i < 6; i++) {
    crackColorOption[i] = loadImage("./assets/crack_" + i +".png");
  }
  for (i = 0; i < 6; i++) {
    patchColorOption[i] = loadImage("./assets/patch_" + i +".png");
  }
}

function setup() {

  createCanvas(windowWidth,windowHeight);


  // socket = io();
  // socket = io.connect('http://localhost:3000');
  //
  // socket.on('crackBroadcast', mirrorCreateCrack);
  // socket.on('deleteBroadcast', mirrorDeleteCrack);



  // for (i = 0; i < maxCracks; i++) {
  //   createCrack();
  // }

}











function createCrack() {
    let lifetime = random(crackLifetime-50, crackLifetime+50);
    let color = random(colorOption);
    let randomX = random(50, windowWidth-50);
    let randomY = random(50, windowHeight-50);
    var crackData = {
      myId: crackId,
      cX: randomX,
      cY: randomY,
      cL: lifetime,
      cC: color,
    }
    socket.emit('newCrack', crackData);
    myCrack.push(new Crack(crackId, randomX, randomY, lifetime, color));
    crackId++;
    if (crackId > maxCracks + 2) {
      crackId = 0;
    }
}

function mirrorCreateCrack(crackData) {
    myCrack.push(new Crack(crackData.myId, crackData.cX, crackData.cY, crackData.cL, crackData.cC));
}

function deleteCrack(i) {
      var deleteId = myCrack[i].getId();
      socket.emit('deleteCrack', deleteId);
      myCrack.splice(i, 1);
      if(myCrack.length < maxCracks) {
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















}


function mouseReleased() {
  for (i = 0; i < myCrack.length; i++) {
    if(myCrack[i].mouseHover()) {
      myCrack[i].setFixed();
      myPlayer[0].setColor();
    }
  }
}
