Array.prototype.parse2D = function () {
    const rows = []
    for (let i = 0; i < this.length; i += 16) {
        rows.push(this.slice(i, i + 16))
    }
    return rows
}

Array.prototype.createObjectsFrom2D = function () {
    const objects = []
    this.forEach((row, y) => {
        row.forEach((symbol, x) => {
            if (symbol == 292 || symbol == 250) {
                // console.log('x: ' + x, 'y: ' + y)
                // Create collision block

                objects.push(
                    ObjectManager.createObject(CollisionBlock, { position: { x: x * 64, y: y * 64 }, displayPosition: { x: x * 64, y: y * 64 } })
                )
            }
        });
    })
    return objects
}


Array.prototype.parse2Dnew = function () {
    const rows = []
    for (let i = 0; i < this.length - 1; i += this[this.length - 1]) {
        rows.push(this.slice(i, i + this[this.length - 1]))
    }
    return rows
}