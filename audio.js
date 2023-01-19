Howler.volume(0.5)

const audio = {
  backgroundMusic: new Howl({
    src: ["./audio/Eleuxelier.mp3", ,],
    autplay: true,
    volume: 0.4,
    onend: () => {
      audio.backgroundMusic2.play()
    }
  }),
  backgroundMusic2: new Howl({
    src: "./audio/TheGauntletAndTheDragon.mp3",
    autplay: true,
    volume: 0.4,
    onend: () => {
      audio.backgroundMusic3.play()
    }
  }),
  backgroundMusic3: new Howl({
    src: "./audio/EraMachine.mp3",
    autplay: true,
    loop: true,
    volume: 0.4,
  }),
  intro: new Howl({
    src: "./audio/intro.wav",
    loop: true,
    volume: 0.5,
    autoplay: true,
  }),
  bomb: new Howl({
    src: "./audio/bomb.mp3",
  }),
  bonus: new Howl({
    src: "./audio/bonus.mp3",
  }),
  enemyShoot: new Howl({
    src: "./audio/enemyShoot.wav",
    volume: 0.25,
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
    src: "./audio/shoot.mp3",
    volume: 0.7,
  }),
  start: new Howl({
    src: "./audio/start.mp3",
  }),
  laser: new Howl({
    src: "./audio/laser.mp3",
    volume: 0.5,
  }),
};