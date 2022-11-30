const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d') // get canvas, set it to 2D

canvas.width = innerWidth
canvas.height = innerHeight

class Player {
    /**
     * Constructor
     * - position
     * - speed
     * - shape (width, height)
     */
    constructor() {
        this.position = {
            x: 200,
            y: 200,
        }

        this.velocity = {
            x: 0,
            y: 0,
        }
        // this.image
        this.width = 100
        this.height = 100
    }

    /**
     * Methods
     */
    draw() {
        c.fillStyle = 'red'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}

const player = new Player() // create object for player
player.draw()

