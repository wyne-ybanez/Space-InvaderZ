/**
 * Invader Projectile Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 * - invader-projectile radius can be static or dynamic
 */
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.width = 6;
    this.height = 15;
  }

  draw() {
    c.fillStyle = "lime";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
