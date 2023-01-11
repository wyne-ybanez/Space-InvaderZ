const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // get canvas, set it to 2D

canvas.width = innerWidth;
canvas.height = innerHeight / 1.5;

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
    if (this.imageLoad) {
      this.draw();
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
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
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;

    this.radius = 5;
  }

  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2); // creates a cirlce
    c.fillStyle = "red";
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
    this.fades = fades
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

    if (this.fades){
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
      this.imageLoad = true

      this.body = {
        image: image,
        width: image.width * scale,
        height: image.height * scale,
      }

      this.position = {
        x: position.x,
        y: position.y,
      }
    }
  }

  draw() {
    c.drawImage(
      this.body.image,
      this.position.x,
      this.position.y,
      this.body.width,
      this.body.height
    )
  }

  update({ velocity }) {
    if (this.imageLoad) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }

  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.body.width / 2,
          y: this.position.y + this.body.height
        },
        velocity: {
          x: 0,
          y: 5,
        }
      })
    )
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
      this.velocity.x = -this.velocity.x * 1.05;
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

    this.width = 3;
    this.height = 10;
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
  static radius = 30
  constructor({ position, velocity }) {
    this.position = position
    this.velocity = velocity
    this.radius = 0
    this.color = 'red'
    this.opacity = 1
    this.active = false

    gsap.to(this, {
      radius: 30
    })
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
    c.closePath()
    c.fillStyle = this.color
    c.fill()
    c.restore()
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (
      this.position.x + this.radius + this.velocity.x >= canvas.width ||
      this.position.x - this.radius + this.velocity.x <= 0
    ) {
      this.velocity.x = -this.velocity.x
    } else if (
      this.position.y + this.radius + this.velocity.y >= canvas.height ||
      this.position.y - this.radius + this.velocity.y <= 0
    )
      this.velocity.y = -this.velocity.y
  }
}

// =============== END OF CLASSES =================

/**
 * Create Objects
 * - create player
 * - create projectiles array
 * - create multiple invader grids
 * - set control keys
 */
const player = new Player()
const projectiles = []
const invaderGrids = [new InvaderGrid()]
const invaderProjectiles = []
const particles = []
const bombs = [
  new Bomb({
    position: {
      x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
      y: randomBetween(Bomb.radius, canvas.height - Bomb.radius),
    },
    velocity: {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    },
  }),
  new Bomb({
    position: {
      x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
      y: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
    },
    velocity: {
      x: (Math.random() - 0.5) * 6,
      y: (Math.random() - 0.5) * 6,
    },
  }),
];

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

let frames = 0;
let score = 0;
let randomInteveral = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: true
}

/**
 * Random Between 2 numbers
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Creates Background Particles
 */
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.4,
      },
      radius: Math.random() * 2,
      color: 'white',
    })
  );
}

/**
 * Create Explosion Particles
 */
function createParticles({ object, color, radius, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.body.width / 2,
          y: object.position.y + object.body.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: radius || Math.random() * 6.7,
        color: color || 'orange',
        fades: fades
      })
    );
  }
}

/**
 * Process Game Animation
 */
function animate() {
  if (!game.active) return

  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // spawn bombs
  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];

    if (bomb.opacity <= 0) {
      bombs.splice(i, 1);
    } else bomb.update();
  }

  player.update();

  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }

    // particles garbage collection
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else particle.update();
  })

  // invader projectiles
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
      ){
      setTimeout(() => {
        invaderProjectiles.splice(index, 1); // take the one projectile out of the array and remove from the scene
      }, 0);
    } else invaderProjectile.update();

    // projectile hits player
    if (
      invaderProjectile.position.y <= // height detection
        player.position.y + player.body.height &&
      invaderProjectile.position.y >=
        player.position.y &&
      invaderProjectile.position.x >= // width detection
        player.position.x &&
      invaderProjectile.position.x <=
        player.position.x + player.body.width
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1); // garbage collection
        player.opacity = 0;
        game.over = true;
      }, 0);
      setTimeout(() => {
        game.active = false;
      }, 2000);
      createParticles({
        object: player,
        color: "white",
        radius: Math.random() * 3,
        fades: true
      })
      createParticles({
        object: player,
        color: "white",
        radius: Math.random() * 4,
        fades: true,
      });
    }
  })

  // player projectiles
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      setTimeout(() => {
        projectiles.splice(index, 1); // take the one projectile out of the array and remove from the scene
      }, 0);
    } else {
      projectile.update();
    }
  });

  // invader grids creation
  invaderGrids.forEach((grid, gridIndex) => {
    grid.update();

    // spawn invader projectiles - calling a random invader to shoot
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity }); // render out each invader in array
      // projectiles hit enemy
      projectiles.forEach((projectile, j) => {
        if (
          projectile.position.y - projectile.radius <= // height detection
            invader.position.y + invader.body.height &&
          projectile.position.y + projectile.radius >= invader.position.y &&
          projectile.position.x + projectile.radius >= // width detection
            invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.body.width
        ) {
          setTimeout(() => {
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );

            // remove invader + projectile (invader hit, projectile fired)
            if (invaderFound && projectileFound) {
              score += 100
              scoreEl.innerHTML = score
              // dynamic score label
              const scoreLabel = document.createElement('label')
              scoreLabel.innerHTML = 100
              scoreLabel.style.position = 'absolute'
              scoreLabel.style.color = 'white'
              scoreLabel.style.top = invader.position.y + 'px'
              scoreLabel.style.left = invader.position.x + 'px'
              scoreLabel.style.userSelect = 'none'
              document.querySelector("#ParentDiv").appendChild(scoreLabel)

              gsap.to(scoreLabel, {
                opacity: 0,
                y: -30,
                duration: .75,
                onComplete: () => {
                  document.querySelector("#ParentDiv").removeChild(scoreLabel)
                }
              });

              createParticles({
                object: invader,
                fades: true
              });
              createParticles({
                object: invader,
                color: 'pink',
                fades: true,
              });
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);

              // update width of invader grid
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.body.width;
                grid.position.x = firstInvader.position.x;
              } else {
                invaderGrids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });

  // spawning enemies
  if (frames % randomInteveral === 0) {
    invaderGrids.push(new InvaderGrid());
    randomInteveral = Math.floor(Math.random() * 500 + 500);
    frames = 0;
  }
  frames++;

  // movement
  // left
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  }
  // right
  else if (keys.d.pressed && player.position.x + player.body.width <= canvas.width) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  }
  // down
  else if (
    keys.s.pressed &&
    player.position.y + player.body.height <= canvas.height
  ) {
    player.velocity.y = 5;
  }
  // up
  else if (
    keys.w.pressed &&
    player.position.y + player.body.height >= 0
  ) {
    player.velocity.y = -5;
  }
  // stop
  else {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.rotation = 0;
  }
}

/**
 * Player Movement Monitor
 * - monitor key down event actions (using object destructuring)
 * - monitor key up event actions
 */
addEventListener("keydown", ({ key }) => {
  if (game.over) return

  switch (key) {
    case "a": // left
    case "ArrowLeft":
      keys.a.pressed = true;
      break;
    case "d": // right
    case "ArrowRight":
      keys.d.pressed = true;
      break;
    case "s": // down
      keys.s.pressed = true;
      break;
    case "w": // up
      keys.w.pressed = true;
      break;
    case " ": // space, shoot by adding projectile to array
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.body.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          },
        })
      );
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a": // left
    case "ArrowLeft":
      keys.a.pressed = false;
      break;
    case "d": // right
    case "ArrowRight":
      keys.d.pressed = false;
      break;
    case "s": // down
      keys.s.pressed = false;
      break;
    case "w": // up
      keys.w.pressed = false;
      break;
    case " ": // space
      break;
  }
});

/**
 * Additional Functions
 * - Random Color Generator (Hex)
 * - Game debugger
 */
const random_hex_color_code = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};

player
  ? console.log("Player: Spawned [✓]")
  : console.log("Player: Not Spawning [x]");

invaderGrids
  ? console.log("Invaders: Spawned [✓]")
  : console.log("Invaders: Not Spawning [x]");

projectiles
  ? console.log("Projectiles: Loaded [✓] ")
  : console.log("Projectiles: Not Loaded [x]");


animate();