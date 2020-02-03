class Player {
  constructor(id, xPos, yPos, color) {
    this.x = xPos;
    this.y = yPos;
    this.color = color;
    this.image = patchColorOption[this.color];
    this.id = id;
  }
}

module.exports = Player;
