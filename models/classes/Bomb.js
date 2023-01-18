/**
 * Bomb Class (object params: position, velocity)
 * - position (x,y)
 * - velocity (x,y)
 */
class Bomb {
  static radius = 30;
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 0;
    this.color = "orangered";
    this.opacity = 1;
    this.active = false;

    gsap.to(this, {
      radius: 30,
    });
  }

  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.closePath();
    c.fillStyle = this.color;
    c.fill();
    c.restore();
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (
      this.position.x + this.radius + this.velocity.x >= canvas.width ||
      this.position.x - this.radius + this.velocity.x <= 0
    ) {
      this.velocity.x = -this.velocity.x;
    } else if (
      this.position.y + this.radius + this.velocity.y >= canvas.height ||
      this.position.y - this.radius + this.velocity.y <= 0
    )
      this.velocity.y = -this.velocity.y;
  }

  explode() {
    audio.bomb.play();
    this.active = true;
    this.velocity.x = 0;
    this.velocity.y = 0;

    gsap.to(this, {
      radius: 300,
      color: "white",
    });

    gsap.to(this, {
      delay: 0.5,
      opacity: 0,
      duration: 1,
    });
  }
}
