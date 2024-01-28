class ObjectManager {
    static screenCenterPosition = {
        x: 488,
        y: 263
    }
    static objects = []
    static pigs = []

    static createObject(Class, ...args) {
        let obj = new Class(...args)
        this.objects.push(obj)
        if (Class === Pig) this.pigs.push(obj)
        return obj
    }


    static getPosition() {
        this.objects.forEach(elem => {
            // console.log(elem.position.x, elem.position.y)
        })
    }

    static cameraShift(offset, axis) {
        if (axis === 'x') {
            this.objects.forEach(elem => {
                if (!elem.displayPosition) return
                elem.displayPosition.x -= offset
            })
        }

        if (axis === 'y') {
            this.objects.forEach(elem => {
                if (!elem.displayPosition) return
                elem.displayPosition.y -= offset
            })
        }
    }

    static cameraCenter() {
        if (!this.objects.some(item => item instanceof Player)) return

        const offset = {
            x: this.screenCenterPosition.x - player.position.x - 55,
            y: this.screenCenterPosition.y - player.position.y - 35,
        }


        this.objects.forEach(elem => {
            elem.displayPosition.x += offset.x
            elem.displayPosition.y += offset.y
        })
    }

    static checkForDamage() {
        this.objects.forEach((elem) => {
            if (elem instanceof Pig) {
                // this.hitbox.displayPosition.x, this.hitbox.displayPosition.y, this.hitbox.width, this.hitbox.height

                // attackHitbox.position.x = this.hitbox.position.x+108
                // attackHitbox.position.y = this.hitbox.position.y+17
                // attackHitbox.width = 60
                // attackHitbox.height = 73

                if (attackHitbox.position.x + attackHitbox.width > elem.position.x + 80 &&
                    attackHitbox.position.x < elem.position.x + 80 + elem.width &&
                    attackHitbox.position.y + 73 > elem.position.y &&
                    attackHitbox.position.y < elem.position.y + elem.height
                ) {
                    if (typeof elem.takeDamage === 'function') elem.takeDamage('right')
                }
            }
        })
    }
}