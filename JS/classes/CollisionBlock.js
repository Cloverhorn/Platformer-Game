class CollisionBlock {
    constructor({ position, displayPosition }) {
        this.position = position
        this.displayPosition = displayPosition
        this.width = 64
        this.height = 64
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0.3)'
        c.fillRect(this.displayPosition.x, this.displayPosition.y, this.width, this.height)
    }
}