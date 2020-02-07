class Player {
  constructor(id, color) {
    this.id = id;
    this.color = color;
    this.x = 0;
    this.y = 0;
  }


  setPosition(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }


  getId() {
    return this.id;
  }


  setColor(color) {
    this.color = color;
  }


  getColor() {
    return this.color;
  }
}


module.exports = Player;
