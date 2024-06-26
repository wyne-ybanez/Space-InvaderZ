/*
  We are using a lot of 'for loops' - looping from the back of an array and splicing
  We do this so we only splice items we have already rendered.

  Anything unrendered is left untouched.
  Meaning, no flashes, no timeouts, seamless experience.
*/

const scoreEl = document.querySelector("#scoreEl");
const canvas = document.querySelector("canvas");
const w = document.querySelector(".w");
const a = document.querySelector(".a");
const s = document.querySelector(".s");
const d = document.querySelector(".d");
const spacebar = document.querySelector(".spacebar");
const startScreen = document.querySelector("#startScreen");
const scoreContainer = document.querySelector("#scoreContainer");
const controls = document.querySelector("#controls");

let spawnBuffer = 500;
let fps = 60;
let fpsInterval = 1000 / fps
let millisecondsPrev = window.performance.now(); // amount of milliseconds that pass during as js code loads (100ms)

let frames = 0;
let score = 0;
let finalScore = document.querySelector("#finalScore");
let randomInteveral = Math.floor(Math.random() * 400 + 500);
let game = {
  over: false,
  active: true,
};

const c = canvas.getContext("2d"); // get canvas, set it to 2D

audio.intro.play();

if (innerWidth <= 600) {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
else {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}


/**
 * Init Objects
 *
 * - player
 * - projectiles array
 * - multiple invader grids
 * - set control keys
 */
let player = new Player()
let projectiles = []
let invaderGrids = [new InvaderGrid()]
let invaderProjectiles = []
let particles = []
let bombs = [];
let powerUps = [];

let keys = {
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

// Initialise Game
function init() {
  // restart all values
  player = new Player();
  projectiles = [];
  invaderGrids = [new InvaderGrid()];
  invaderProjectiles = [];
  particles = [];
  bombs = [];
  powerUps = [];
  keys = {
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
  frames = 0;
  score = 0;
  finalScore.innerHTML = score;
  scoreEl.innerHTML = score;
  randomInteveral = Math.floor(Math.random() * 400 + 500);
  spawnBuffer = 500;
  game = {
    over: false,
    active: true,
  };

  // Background Particles
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
        color: "white",
      })
    );
  }
}

/**
 * End Game
 *
 * - makes player disappear
 * - stops game
 * - player explosion particles
 */
function endGame() {
    audio.gameOver.play();
    setTimeout(() => {
      player.opacity = 0;
      game.over = true;
    }, 0);

    setTimeout(() => {
      game.active = false;
      document.querySelector('#restartScreen').style.display = 'flex';
      document.querySelector("#finalScore").innerHTML = score;
    }, 2000);

    createParticles({
      object: player,
      color: "white",
      radius: Math.random() * 3,
      fades: true,
    });

    createParticles({
      object: player,
      color: "white",
      radius: Math.random() * 4,
      fades: true,
    });
}

/**
 * Animation Loop
 */
function animate() {
  if (!game.active) return;
  requestAnimationFrame(animate);

  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);

  // frame rate control
  const millisecondsNow = window.performance.now(); // this keeps increasing in animation loop
  const elapsed = millisecondsNow - millisecondsPrev;

  if (elapsed < fpsInterval) return;

  // at 60fps, we want 16.66ms (1000ms / 60fps)
  millisecondsPrev = millisecondsNow - (elapsed % fpsInterval) // 3.34

  // Initiate PowerUps
  for (let i = powerUps.length - 1; i >= 0; i--) {
    const powerUp = powerUps[i];
    if (powerUp.position.x - powerUp.radius >= canvas.width) {
      powerUps.splice(i, 1); // garbage collection
    } else powerUp.update();
  }

  // spawning powerups
  if (frames % 400 === 0) {
    powerUps.push(
      new PowerUp({
        position: {
          x: 0,
          y: Math.random() * 500 + 15,
        },
        velocity: {
          x: 5,
          y: 0,
        },
      })
    );
  }

  // spawn Bombs
  if (frames % 400 === 0) {
    bombs.push(
      new Bomb({
        position: {
          x: randomBetween(Bomb.radius, canvas.width - Bomb.radius),
          y: randomBetween(Bomb.radius, canvas.height - Bomb.radius),
        },
        velocity: {
          x: (Math.random() - 0.5) * 6,
          y: (Math.random() - 0.5) * 6,
        },
      })
    );
  }

  for (let i = bombs.length - 1; i >= 0; i--) {
    const bomb = bombs[i];

    if (bomb.opacity <= 0) {
      bombs.splice(i, 1);
    } else bomb.update();
  }

  // spawn Player
  player.update();

  for (let i = player.particles.length - 1; i >= 0; i--) {
    const particle = player.particles[i];
    particle.update();

    if (particle.opacity === 0) {
      // particle garbage collection if player dies
      player.particles[i].splice(i, 1);
    }
  }

  // initiates particles
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
  });

  // invader projectiles
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1); // take the one projectile out of the array and remove from the scene, starting from i
      }, 0);
    } else invaderProjectile.update();

    // projectile hits player
    if (
      rectangularCollision({
        rectangle1: invaderProjectile,
        rectangle2: player,
      })
    ) {
      invaderProjectiles.splice(index, 1); // garbage collection
      endGame();
    }
  });

  // player projectiles
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];

    for (let j = bombs.length - 1; j >= 0; j--) {
      const bomb = bombs[j];

      // if projectile touches bomb, remove projectile
      if (
        Math.hypot(
          projectile.position.x - bomb.position.x,
          projectile.position.y - bomb.position.y
        ) <
          projectile.radius + bomb.radius &&
        !bomb.active
      ) {
        projectiles.splice(i, 1);
        bomb.explode();
      }
    }

    for (let j = powerUps.length - 1; j >= 0; j--) {
      const powerUp = powerUps[j];

      // if projectile touches PowerUp, remove projectile
      if (
        Math.hypot(
          projectile.position.x - powerUp.position.x,
          projectile.position.y - powerUp.position.y
        ) <
        projectile.radius + powerUp.radius
      ) {
        projectiles.splice(i, 1);
        powerUps.splice(j, 1);
        player.powerUp = "Laser";
        console.log("PowerUp Started");
        audio.bonus.play();

        setTimeout(() => {
          player.powerUp = null;
          console.log("PowerUp Ended");
        }, 10000);
      }
    }

    if (projectile.position.y + projectile.radius <= 0) {
      projectiles.splice(i, 1); // take the one projectile out of the array and remove from the scene
    } else {
      projectile.update();
    }
  }

  // invader grids creation
  invaderGrids.forEach((grid, gridIndex) => {
    grid.update();

    // spawn invader projectiles - calling a random invader to shoot
    if (frames % 100 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    for (let i = grid.invaders.length - 1; i >= 0; i--) {
      const invader = grid.invaders[i];
      invader.update({ velocity: grid.velocity }); // render out each invader in array

      for (let j = bombs.length - 1; j >= 0; j--) {
        const bomb = bombs[j];
        const invaderRadius = 15;

        // if bomb touches invader, remove invader
        if (
          Math.hypot(
            invader.position.x - bomb.position.x,
            invader.position.y - bomb.position.y
          ) <
            invaderRadius + bomb.radius &&
          bomb.active
        ) {
          score += 50;
          scoreEl.innerHTML = score;

          grid.invaders.splice(i, 1);
          createScoreLabel({
            score: 50,
            object: invader,
          });
          createParticles({
            object: invader,
            color: "white",
            radius: Math.random() * 4,
            fades: true,
          });
        }
      }

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

            // projectile hits enemy
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;
              createScoreLabel({
                object: invader,
              });

              createParticles({
                object: invader,
                fades: true,
              });
              createParticles({
                object: invader,
                color: "pink",
                fades: true,
              });

              // singular projectile hits an enemy
              audio.explode.play();
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

      // remove player if invader touches them
      if (
        rectangularCollision({
          rectangle1: invader,
          rectangle2: player,
        })
      ) {
        endGame();
      }
    } // end looping over grid.invaders
  });

  // spawn enemies
  if (frames % randomInteveral === 0) {
    spawnBuffer = spawnBuffer < 0 ? 10 : spawnBuffer; // spawnBuffer cannot be a negative value
    invaderGrids.push(new InvaderGrid());
    randomInteveral = Math.floor(Math.random() * 500 + spawnBuffer);
    frames = 0;
    spawnBuffer -= 100;
  }

  // Laser PowerUp
  if (
    keys.space.pressed &&
    player.powerUp === "Laser" &&
    !game.over
    ) {
      audio.laser.play();
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
          color: "red",
        })
      );
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
  // down
  else if (
    keys.s.pressed &&
    player.position.y + player.body.height <= canvas.height
  ) {
    player.velocity.y = 5;
  }
  // up
  else if (keys.w.pressed && player.position.y + player.body.height >= 0) {
    player.velocity.y = -5;
  }
  // stoppers 
  else if (
    player.position.y + player.body.height === canvas.height ||
    player.body.height >= canvas.height ||
    player.rotation >= canvas.height
    ) {
    player.rotation = 0;
    player.velocity.x = 0;
    player.velocity.y = 0;
  }
  // stop
  else {
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.rotation = 0;
  }
}

/**
 * Start Game
 * - when button is clicked on game ui
 */
document.querySelector('#startButton').addEventListener('click',
  () => {
    audio.intro.stop()
    audio.backgroundMusic.play();
    audio.select.play();

    startScreen.style.display = "none";
    scoreContainer.style.display = "block";
    w.style.display = "block";
    a.style.display = "block";
    s.style.display = "block";
    d.style.display = "block";
    spacebar.style.display = "block";
    init()
    animate()
  }
)

/**
 * Restart Game
 * - when button is clicked on game ui
 */
document.querySelector('#restartButton').addEventListener('click',
  () => {
    audio.select.play()
    document.querySelector("#restartScreen").style.display = 'none';
    init()
    animate()
  }
)

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
      a.style.background = "#fff";
      a.style.color = "#000";
      break;
    case "d": // right
    case "ArrowRight":
      keys.d.pressed = true;
      d.style.background = "#fff";
      d.style.color = "#000";
      break;
    case "s": // down
    case "ArrowDown":
      keys.s.pressed = true;
      s.style.background = "#fff";
      s.style.color = "#000";
      break;
    case "w":
    case "ArrowUp": // up
      keys.w.pressed = true;
      w.style.background = "#fff";
      w.style.color = "#000";
      break;
    case " ": // space, shoot by adding projectile to array
      keys.space.pressed = true

      if (player.powerUp === 'Laser') return

      audio.shoot.play()
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.body.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          }
        })
      );
      spacebar.style.background = "#fff";
      spacebar.style.color = "#000";
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  switch (key) {
    case "a": // left
    case "ArrowLeft":
      keys.a.pressed = false;
      a.style.background = "transparent";
      a.style.color = "#fff";
      break;
    case "d": // right
    case "ArrowRight":
      keys.d.pressed = false;
      d.style.background = "transparent";
      d.style.color = "#fff";
      break;
    case "s": // down
    case "ArrowDown":
      keys.s.pressed = false;
      s.style.background = "transparent";
      s.style.color = "#fff";
      break;
    case "w": // up
    case "ArrowUp":
      keys.w.pressed = false;
      w.style.background = "transparent";
      w.style.color = "#fff";
      break;
    case " ": // space
      keys.space.pressed = false;
      spacebar.style.background = "transparent";
      spacebar.style.color = "#fff";
      break;
  }
});

player
  ? console.log("Player: Spawned [✓]")
  : console.log("Player: Not Spawning [x]");

invaderGrids
  ? console.log("Invaders: Spawned [✓]")
  : console.log("Invaders: Not Spawning [x]");

projectiles
  ? console.log("Projectiles: Loaded [✓] ")
  : console.log("Projectiles: Not Loaded [x]");