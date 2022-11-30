const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // get canvas, set it to 2D

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
  /**
   * ====== Constructor
   * - starting position
   * - velocity
   * - body (image, width, height)
   */
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

  /**
   * ====== Methods
   */

  /**
   * Draw Player
   * - draws player
   * - sets player ship rotation
   * - restore context after rotation
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
   * - updates player position/changes
   */
  update() {
    if (this.imageLoad) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

/**
 * Create Player Instance
 * - set control keys
 */
const player = new Player()
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};

/**
 * Player debugger
 */
if (player) {
    console.log("Process: Player Generated [✓]");
} else {
    console.log("Process: Player Not Generated [x]");
}

/**
 * Process Game Animation
 * - check for player existence
 * - check for movement
 */
function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()

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
        keys.a.pressed = true;
        break;
      case "d": // right
        keys.d.pressed = true;
        break;
      case "s": // down
        break;
      case "w": // up
        break;
      case " ": // space
        break
    }
})

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a": // left
      keys.a.pressed = false;
      break;
    case "d": // right
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