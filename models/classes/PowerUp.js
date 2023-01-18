/**
 * PowerUp Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 * - PowerUp radius can be static or dynamic
 */
class PowerUp {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 15;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a cirlce
    c.fillStyle = "skyblue";
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
