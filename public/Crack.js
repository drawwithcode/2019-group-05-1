class Crack {
  constructor(crack) {
    this.rainbow = crack.rainbow;
    this.x = crack.x;
    this.y = crack.y;
    this.color = crack.color;
    this.width = 30
    this.height = 90
  }


  clicked() {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
      return true;
    } else {
      return false;
    }
  }

  draw() {
    fill(this.color);
    noStroke();
    beginShape();
    vertex(this.x + this.width - 5, this.y + this.height - 90);
    vertex(this.x + this.width - 30, this.y + this.height - 50);
    vertex(this.x + this.width - 20, this.y + this.height - 50);
    vertex(this.x + this.width - 30, this.y + this.height - 30);
    vertex(this.x + this.width - 20, this.y + this.height - 30);
    vertex(this.x + this.width - 30, this.y + this.height);
    vertex(this.x + this.width, this.y + this.height - 40);
    vertex(this.x + this.width - 10, this.y + this.height - 40);
    vertex(this.x + this.width, this.y + this.height - 60);
    vertex(this.x + this.width - 12, this.y + this.height - 60);
    endShape(CLOSE);
  }


  setColor(color) {
    this.color = color;
  }


  getColor() {
    return this.color;
  }


  getRainbow() {
    return this.rainbow;
  }
}
