class Crack {
  constructor(color, rainbow) {
    this.rainbow = rainbow;
    this.color = color;
    this.x = Math.random() * 400 + 40;
    this.y = Math.random() * 400 + 40;
  }


  setPosition(xPos, yPos) {
    this.x = xPos;
    this.y = yPos;
  }


  getPosition() {
    var data = {
      xPos: this.x,
      yPos: this.y
    };
    return data;
  }


  getColor() {
    return this.color;
  }
}


module.exports = Crack;
