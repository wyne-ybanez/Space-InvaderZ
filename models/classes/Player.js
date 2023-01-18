/**
 * Player Class
 * - starting position
 * - velocity
 * - body (image, width, height)
 */
class Player {
  constructor() {
    const image = new Image(); // this comes from the JavaScript API
    image.src = "./img/spaceship.png"; // get the image but takes time to load
    const scale = 0.15;
    const margin = 50;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;
    this.shadowColor = "skyblue";
    this.shadowBlur = 20;

    // Image has loaded hence, set attributes
    image.onload = () => {
      this.imageLoad = true;

      this.body = {
        image: image,
        width: image.width * scale,
        height: image.height * scale,
      };

      this.position = {
        x: canvas.width / 2 - this.body.width / 2,
        y: canvas.height - this.body.height - margin,
      };
    };

    this.particles = [];
    this.frames = 0;
  }

  //====== Methods
  /**
   * Draw Player
   */
  draw() {
    // DEBUGGING - comment out if unused
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.body.width, this.body.height)
    c.save();

    // set player opacity
    c.globalAlpha = this.opacity;

    // makes rotatation
    c.translate(
      player.position.x + player.body.width / 2,
      player.position.y + player.body.height / 2
    );
    c.rotate(this.rotation);

    // clean up after rotation
    c.translate(
      -player.position.x - player.body.width / 2,
      -player.position.y - player.body.height / 2
    );

    c.drawImage(
      this.body.image,
      this.position.x,
      this.position.y,
      this.body.width,
      this.body.height
    );
    c.restore();
  }

  /**
   * Update Player
   */
  update() {
    if (!this.imageLoad) return;
    if (this.opacity !== 1) return;

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.frames++;

    if (this.frames % 2 === 0) {
      this.particles.push(
        new Particle({
          position: {
            x: this.position.x + this.body.width / 2,
            y: this.position.y + this.body.height,
          },
          velocity: {
            x: (Math.random() - 0.5) * 1.3,
            y: 1.4,
          },
          radius: Math.random() * 2,
          color: "skyblue",
          fades: true,
        })
      );
    }
  }
}
