Howler.volume(0.5)

const audio = {
  backgroundMusic: new Howl({
    src: "./audio/backgroundMusic.wav",
    loop: true,
  }),
  bomb: new Howl({
    src: "./audio/bomb.mp3",
  }),
  bonus: new Howl({
    src: "./audio/bonus.mp3",
  }),
  enemyShoot: new Howl({
    src: "./audio/enemyShoot.wav",
  }),
  explode: new Howl({
    src: "./audio/explode.mp3",
  }),
  flame: new Howl({
    src: "./audio/flame.mp3",
  }),
  gameOver: new Howl({
    src: "./audio/gameOver.mp3",
  }),
  select: new Howl({
    src: "./audio/select.mp3",
  }),
  shoot: new Howl({
    src: "./audio/shoot.wav",
    volume: 0.7,
  }),
  start: new Howl({
    src: "./audio/start.mp3",
  }),
  laser: new Howl({
    src: "./audio/laser.mp3",
  }),
};