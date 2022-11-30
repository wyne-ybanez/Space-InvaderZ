const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // get canvas, set it to 2D

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    /**
     * Constructor
     * - starting position
     * - velocity
     * - body (image, width, height)
     */
    constructor() {
        const image = new Image() // this comes from the JavaScript API
        image.src = './img/spaceship.png' // get the image but takes time to load
        const scale = 0.15;
        const margin = 50

        // Set attributes after loading
        image.onload = () => {
            this.velocity = {
              x: 0,
              y: 0,
            };

            this.body = {
              image: image,
              width: image.width * scale,
              height: image.height * scale,
            }

            this.position = {
              x: (canvas.width / 2) - (this.body.width / 2),
              y: canvas.height - this.body.height - margin
            };
        }
    }

    /**
     * Methods
     */
    draw() {
        // DEBUGGING - comment out if unused
        // c.fillStyle = 'red'
        // c.fillRect(this.position.x, this.position.y, this.width, this.height)
        if (this.body) {
            c.drawImage(
                this.body.image,
                this.position.x,
                this.position.y,
                this.body.width,
                this.body.height
            )
        }
    }
}

const player = new Player() // create object for player
player.draw()

function animate() {
    requestAnimationFrame(animate)
    c.fillStyle = "black"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.draw()
    // console.log('Process: Animation Running ✓')
}

animate()