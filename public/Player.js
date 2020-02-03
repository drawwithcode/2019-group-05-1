class Player {
  constructor(id, xPos, yPos, color) {
    this.x = xPos;
    this.y = yPos;
    this.color = color;
    this.image = patchColorOption[this.color];
    this.id = id;
  }
  display() {
    image(this.image, this.x, this.y);
  }
  update() {
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
    this.image = patchColorOption[this.color];
  }
  getId() {
    return this.id;
  }
}
