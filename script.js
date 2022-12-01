const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // get canvas, set it to 2D

canvas.width = innerWidth
canvas.height = innerHeight

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

    this.radius = 3;
  }

  //====== Methods
  /**
   * Draw
   * - sets projectile circular shape
   * - sets projectile color
   */
  draw() {
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0,
        Math.PI * 2) // creates a cirlce
    c.fillStyle = 'red'
    c.fill()
    c.closePath()
  }

  /**
   * Update
   */
  update() {
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y
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
        y: position.y
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
      x: 0,
      y: 0,
    };

    this.invaders = [];

    // equation to set rows and columns for grid
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2)

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
      console.log(this.invaders);
    }
  }

  //====== Methods
  update() {
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

/**
 * Process Game Animation
 * - updates player
 * - updates projectiles in projectile array
 * - updates invader grids
 * - check for player movement
 */
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

    // Projectile refresh when hits the top of screen
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0){
          setTimeout(() => {
            projectiles.splice(index, 1) // take the one projectile out of the array and remove from the scene
          }, 0)
        } else {
          projectile.update();
        }
    })

    // Invader Grids
    invaderGrids.forEach(grid => {
      grid.update()
      grid.invaders.forEach(invader => { // render out each invader in array
        invader.update()
      })
    })

    // movement
    // left
    if (keys.a.pressed && (player.position.x >= 0)) {
      player.velocity.x = -7;
      player.rotation = -.15
    }
    // right
    else if (keys.d.pressed && (player.position.x + player.body.width <= canvas.width)) {
      player.velocity.x = 7;
      player.rotation = .15
    }
    // stop
    else {
      player.velocity.x = 0;
      player.rotation = 0;
    }
}

animate();

/**
 * Player Movement Monitor
 * - monitor key down event actions (using object destructuring)
 * - monitor key up event actions
 */
addEventListener('keydown', ({key}) => {
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
              x: player.position.x + (player.body.width / 2),
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
})

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
if (player) {
    console.log("Player: Spawned [✓]");
} else {
    console.log("Player: Not Spawning [x]");
}

if (invaderGrids) {
  console.log("Invaders: Spawned [✓]");
} else {
  console.log("Invaders: Not Spawning [x]");
}