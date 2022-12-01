const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // get canvas, set it to 2D

canvas.width = innerWidth;
canvas.height = innerHeight;

/**
 * Projectile Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 * - projectile radius can be static or dynamic
 */
export default class Projectile {
  //====== Constructor
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 3;
  }

  //====== Methods
  /**
   * Draw
   * - sets projectile circular shape
   * - sets projectile color
   */
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a cirlce
    c.fillStyle = "red";
    c.fill();
    c.closePath();
  }

  /**
   * Update
   * - updates projectile position
   */
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
