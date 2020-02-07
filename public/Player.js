class Player {
  constructor(player) {
    this.x = player.x;
    this.y = player.y;
    this.id = player.id;
    this.color = player.color;
  }


  draw() {
    fill(this.color);
    circle(this.x, this.y, 20);
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
