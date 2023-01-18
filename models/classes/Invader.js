/**
 * Invader Class
 * - starting position
 * - velocity
 * - body (image, width, height)
 *
 * @params 'position' as object
 */
class Invader {
  constructor({ position }) {
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
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    c.drawImage(
      this.body.image,
      this.position.x,
      this.position.y,
      this.body.width,
      this.body.height
    );
  }

  update({ velocity }) {
    if (this.imageLoad) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    audio.enemyShoot.play();
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.body.width / 2,
          y: this.position.y + this.body.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}
