class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.radius = 10;
    this.id = player.id;
    this.color = player.color;
  }


  draw() {
    fill(this.color);
    noCursor();
    circle(this.x, this.y, this.radius*2);
  }

  intersect(playerX, playerY) {
    if (playerX > this.x && playerX < this.x + this.radius && playerY > this.y && playerY < this.y + this.radius) {
      return true;
    } else {
      return false;
    }
  }


  update(player) {
    this.x = player.x;
    this.y = player.y;
    this.color = player.color;
  }


  getId() {
    return this.id;
  }


  getColor() {
    return this.color;
  }

}
