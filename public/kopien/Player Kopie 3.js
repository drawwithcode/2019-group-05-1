class Player {
  constructor(id) {
    this.x = 0;
    this.y = 0;
    this.color = color;
    this.image = patchColorOption[this.color];
    this.id = id;
  }
  display() {
    image(this.image, this.x, this.y);
  }

  update() {
    this.image = patchColorOption[this.color];


  }

  setPosition(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }

  getColor() {
    return this.color;
  }

  setColor() {
    this.color = random(colorOption)
  }

}

// module.exports = Player;
