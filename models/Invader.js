const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // get canvas, set it to 2D

canvas.width = innerWidth;
canvas.height = innerHeight;

/**
 * Invader Class
 * - starting position
 * - velocity
 * - body (image, width, height)
 */
class Invader {
  // ====== Constructor
  constructor() {
    const image = new Image(); // this comes from the JavaScript API
    image.src = "./img/invader.png"; // get the image but takes time to load
    const scale = 1;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;

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
        y: canvas.height / 2,
      };
    };
  }

  //====== Methods
  /**
   * Draw Invader
   */
  draw() {
    c.drawImage(
      this.body.image,
      this.position.x,
      this.position.y,
      this.body.width,
      this.body.height
    );
  }

  /**
   * Update Invader
   */
  update() {
    if (this.imageLoad) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    }
  }
}
