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

/**
 * Invader Grid Class
 * - position
 * - velocity
 */
class InvaderGrid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };

    this.velocity = {
      x: 3,
      y: 0,
    };

    this.invaders = [];

    // equation to set rows, columns, width for grid
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);

    this.width = columns * 30; // 30 is the width of each invader

    // first loop: handles columns
    // second loop: handles rows
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
  }

  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.velocity.y = 0;

    // if Invader Grid hits canvas edge
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x * 1.25;
      this.velocity.y = 30;
    }
  }
}

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
