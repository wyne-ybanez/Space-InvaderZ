const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d"); // get canvas, set it to 2D

canvas.width = innerWidth;
canvas.height = innerHeight;

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

  //====== Methods
  /**
   * Draw
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
   */
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
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
    c.fillStyle = "white";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
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
const player = new Player();
const projectiles = [];
const invaderGrids = [new InvaderGrid()];
const invaderProjectiles = [];

const keys = {
  a: {
    pressed: false,
  },
  d: {
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
let randomInteveral = Math.floor(Math.random() * 500 + 500);

/**
 * Process Game Animation
 * - updates player
 * - updates projectiles
 * - updates invader grids
 * - check for player movement
 */
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();

  // invader projectiles
  invaderProjectiles.forEach((invaderProjectile) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
      ){
      setTimeout(() => {
        invaderProjectiles.splice(index, 1); // take the one projectile out of the array and remove from the scene
      }, 0);
    } else invaderProjectile.update();

    if (
      invaderProjectile.position.y + invaderProjectile.height >= 
      player.position.y && 
      invaderProjectile.position.x + invaderProjectile.width >= 
      player.position.x && 
      invaderProjectile.position.x <= 
      player.position.x + player.body.width
      ) {
        console.log('You lose!')
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
      // collision detection
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
            // find what we need to remove (invader hit, projectile fired)
            const invaderFound = grid.invaders.find(
              (invader2) => invader2 === invader
            );
            const projectileFound = projectiles.find(
              (projectile2) => projectile2 === projectile
            );
            // if found, remove them
            if (invaderFound && projectileFound) {
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
  else if (
    keys.d.pressed &&
    player.position.x + player.body.width <= canvas.width
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  }
  // stop
  else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
}

/**
 * Player Movement Monitor
 * - monitor key down event actions (using object destructuring)
 * - monitor key up event actions
 */
addEventListener("keydown", ({ key }) => {
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
      break;
    case "w": // up
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
      break;
    case "w": // up
      break;
    case " ": // space
      break;
  }
});

/**
 * Game debugger
 */
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