/**
 * Particle Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 * - particle radius can be static or dynamic
 */
class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }

  draw() {
    c.save();
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a cirlce
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.fades) {
      this.opacity -= 0.01; // fades out particles
    }
  }
}
