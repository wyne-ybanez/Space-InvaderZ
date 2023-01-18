/**
 * Projectile Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 * - projectile radius can be static or dynamic
 */
class Projectile {
  constructor({ position, velocity, color = "red" }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
    this.color = color;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a cirlce
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
