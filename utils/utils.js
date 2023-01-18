/**
 * Score Label Creation
 */
function createScoreLabel({ score = 100, object }) {
  const scoreLabel = document.createElement("label");
  scoreLabel.innerHTML = score;
  scoreLabel.style.position = "absolute";
  scoreLabel.style.color = "white";
  scoreLabel.style.top = object.position.y + "px";
  scoreLabel.style.left = object.position.x + "px";
  scoreLabel.style.userSelect = "none";
  document.querySelector("#ParentDiv").appendChild(scoreLabel);

  gsap.to(scoreLabel, {
    opacity: 0,
    y: -30,
    duration: 0.75,
    onComplete: () => {
      document.querySelector("#ParentDiv").removeChild(scoreLabel);
    },
  });
}

/**
 * Rectangular Collision Detection
 */
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.y <= // height detection
      rectangle2.position.y + rectangle2.body.height &&
    rectangle1.position.y >= rectangle2.position.y &&
    rectangle1.position.x >= // width detection
      rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.body.width
  );
}

/**
 * Random Between 2 numbers
 */
function randomBetween(min, max) {
  return Math.random() * (max - min) + min
}

/**
 * Random Color Generator (Hex)
 */
const random_hex_color_code = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};


/**
 * Create Particles
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