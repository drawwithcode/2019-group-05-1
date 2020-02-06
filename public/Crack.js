class Crack {
  constructor(id, xPos, yPos, lifetime, color) {
    this.id = id;
    this.x = xPos;
    this.y = yPos;
    this.fixed = false;
    this.lifetime = lifetime;
    this.color = color;
    this.image = crackColorOption[this.color];
  }
  display() {
    image(this.image, this.x, this.y, crackWidth, crackHeight);
  }
  update() {
    if (this.lifetime < 0) {
      this.fixed = true;
    } else {
      this.lifetime = this.lifetime - 1;
      this.fixed = false;
    }
  }
  getFixed() {
    return this.fixed;
  }
  setFixed() {
    this.fixed = true;
  }
  getId() {
    return this.id;
  }
  mouseHover() {
    if (mouseX > this.x && mouseX < this.x + crackWidth && mouseY > this.y && mouseY < this.y + crackHeight && this.color == allPlayers[0].getColor()) {
      return true;
    } else {
      return false;
    }
  }
}
