class Player extends Sprite {
    constructor({ position = { x: 200, y: 200 }, collisionBlocks = [], imageSrc, frameRate, animations, loop, frameBuffer, scale }) {
        super({ imageSrc, frameRate, animations, loop, frameBuffer, position, scale })
        // this.position = {
        //     x: 200,
        //     y: 200
        // }
        // this.position = position
        this.velocity = {
            x: 0,
            y: 0
        }
        this.hitbox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 35
            },
            width: 50,
            height: 53
        }

        this.attackTimeout = 500
        this.sides = {
            bottom: this.position.y + this.height
        }

        this.gravity = 1
        this.loop = loop
        this.collisionBlocks = collisionBlocks
        this.animationPrevent = false
        this.hp = 5
    }

    setPosition({ position }) {
        this.position = position
        this.displayPosition = { ...this.position }
    }

    update() {
        this.offset = { ...this.position }
        this.position.x += this.velocity.x
        // this.updateCamera()

        this.updateHitbox()
        // Проверяем горизонтальную коллизию
        this.checkForhorizontalCollision()

        // Изобретаем гравитацию
        this.applyGraivty()

        //Обновляем позицию хитбокса игрока
        this.updateHitbox()

        // Проверяем вертикальную коллизию
        this.checkForVerticalCollisions()
        this.updateCamera()

        // Проверка коллизии с границей canvas
        // if (this.sides.bottom + this.velocity.y < canvas.height) {  

        this.updateDisplayPosition()
    }

    centerCamera() {
        if (!background.displayPosition) return
        if (this.isCentered) return

        ObjectManager.cameraCenter()
        this.isCentered = true
    }

    updateCamera() {
        if (!background.displayPosition) return
        if (!this.isCollisionHorizontal) {
            ObjectManager.cameraShift(this.velocity.x, 'x')
        }
        ObjectManager.cameraShift(this.velocity.y, 'y')
    }

    updateDisplayPosition() {
        // this.displayPosition = { ...this.position }
        this.displayPosition.x += this.position.x - this.offset.x
        this.displayPosition.y += this.position.y - this.offset.y
    }

    switchSprite(name) {
        if (this.image === this.animations[name].image || this.animationPrevent) return
        this.currentFrame = 0
        this.image = this.animations[name].image
        this.frameRate = this.animations[name].frameRate
        this.frameBuffer = this.animations[name].frameBuffer
        this.loop = this.animations[name].loop
        this.currentAnimation = this.animations[name]

    }

    updateHitbox() {
        this.hitbox = {
            position: {
                x: this.position.x + 58,
                y: this.position.y + 35
            },
            displayPosition: {
                x: this.displayPosition.x,
                y: this.displayPosition.y
            },
            width: 50,
            height: 53
        }
    }


    applyGraivty() {
        if (this.velocity.y < 15) {
            this.velocity.y += this.gravity
        }
        this.position.y += this.velocity.y
    }

    checkForVerticalCollisions() {
        this.verticalCollisionX = null
        this.verticalCollisionY = null
        this.isCollisionVertical = false
        // console.log(this.hitbox.position.x)
        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            // Проверка коллизий
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height) {

                this.isCollisionVertical = true
                // Коллизия по оси y при движении вверх 
                if (this.velocity.y < 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y
                    this.position.y = collisionBlock.position.y + collisionBlock.height - offset + 0.01

                    this.verticalCollisionX = collisionBlock.displayPosition.x
                    this.verticalCollisionY = collisionBlock.displayPosition.y

                    break
                }
                // Коллизия по оси y при движении вниз
                if (this.velocity.y > 0) {
                    this.velocity.y = 0
                    const offset = this.hitbox.position.y - this.position.y + this.hitbox.height
                    this.position.y = collisionBlock.position.y - offset - 0.01

                    this.verticalCollisionX = collisionBlock.displayPosition.x
                    this.verticalCollisionY = collisionBlock.displayPosition.y

                    break
                }
            }
        }
    }

    drawCollisions() {
        return

        if (this.isCollisionVertical) {
            c.fillStyle = 'rgba(63, 195, 128, 0.3)'
            c.fillRect(this.verticalCollisionX, this.verticalCollisionY, 64, 64)
        }
        if (this.isCollisionHorizontal) {
            c.fillStyle = 'rgba(63, 195, 128, 0.3)'
            c.fillRect(this.horizontalCollisionX, this.horizontalCollisionY, 64, 64)
        }

    }

    checkForhorizontalCollision() {
        this.horizontalCollisionX = null
        this.horizontalCollisionY = null
        this.isCollisionHorizontal = false

        for (let i = 0; i < this.collisionBlocks.length; i++) {
            const collisionBlock = this.collisionBlocks[i]
            // Проверка коллизий
            if (this.hitbox.position.x <= collisionBlock.position.x + collisionBlock.width &&
                this.hitbox.position.x + this.hitbox.width >= collisionBlock.position.x &&
                this.hitbox.position.y + this.hitbox.height >= collisionBlock.position.y &&
                this.hitbox.position.y <= collisionBlock.position.y + collisionBlock.height) {

                this.isCollisionHorizontal = true
                // Коллизия по оси х при движении влево 
                if (this.velocity.x < 0) {
                    const offset = this.hitbox.position.x - this.position.x

                    // Старая проверка коллизии
                    this.position.x = collisionBlock.position.x + collisionBlock.width - offset + 0.01


                    this.horizontalCollisionX = collisionBlock.position.x
                    this.horizontalCollisionY = collisionBlock.position.y

                    break
                }
                // Коллизия по оси х при движении вправо
                if (this.velocity.x > 0) {
                    const offset = this.hitbox.position.x - this.position.x

                    // Старая проверка коллизии
                    this.position.x = collisionBlock.position.x - this.hitbox.width - offset - 0.01

                    this.horizontalCollisionX = collisionBlock.position.x
                    this.horizontalCollisionY = collisionBlock.position.y

                    break
                }
            }
        }
    }




    handleInput(keys) {
        if (player.preventInput) return
        this.velocity.x = 0

        let lastKey = null
        let currentKey = Object.keys(keys).find(key => keys[key].pressed && key !== 'w' && key !== 'k');
        if (currentKey) {
            lastKey = currentKey;
        }

        if (keys.w.pressed) {
            if (player.velocity.y === 0 && player.isCollisionVertical) {
                this.lastDirection = 'up'
                player.velocity.y = -12
            }
        }
        if (keys.k.pressed && !this.attackPrevent) {
            this.attackPrevent = true
            if (this.lastDirection === 'right') {
                this.switchSprite('attack')
                this.animationPrevent = true
            }

            else if (this.lastDirection === 'left') {
                this.switchSprite('attackLeft')
                this.animationPrevent = true
            }
            this.attack()
            setTimeout(() => {
                this.attackPrevent = false
            }, this.attackTimeout)
        }

        // if (keys.d.pressed) {
        //     this.switchSprite('runRight')
        //     this.lastDirection = 'right'
        //     this.velocity.x = 6
        // }

        // if (keys.a.pressed) {
        //     this.switchSprite('runLeft')
        //     this.lastDirection = 'left'
        //     this.velocity.x = -6
        // }
        // else if (keys.k.pressed) {
        //     if (this.lastDirection === 'right') {
        //         this.switchSprite('attack')
        //         this.animationPrevent = true
        //     }

        //     else {
        //         this.switchSprite('attackLeft')
        //         this.animationPrevent = true
        //     }
        // }

        // else {
        //     if (this.lastDirection === 'left') this.switchSprite('idleLeft')
        //     else if (this.lastDirection === 'right') this.switchSprite('idleRight')
        // }

        // if (keys.w.pressed) {
        //     if (player.velocity.y === 0 && player.isCollisionVertical) {
        //         // this.lastDirection = 'up'
        //         player.velocity.y = -12
        //     }
        // }

        switch (lastKey) {
            case 'w':
                break;
            case 'a':
                this.switchSprite('runLeft')
                this.lastDirection = 'left'
                this.velocity.x = -6
                break;
            case 'd':
                this.switchSprite('runRight')
                this.lastDirection = 'right'
                this.velocity.x = 6
                break;
            case 'k':
                break;
            default:
                if (this.lastDirection === 'left') this.switchSprite('idleLeft')
                else if (this.lastDirection === 'right') this.switchSprite('idleRight')
        }
    }

    attack() {
        // if (this.attack) {
        // }
        if (this.lastDirection === 'left') {
            // Заливка хитбокса атаки черным
            // c.fillStyle = 'black'
            // c.fillRect(player.hitbox.displayPosition.x, player.hitbox.displayPosition.y + 17, 60, 73)

            attackHitbox.position.x = this.hitbox.position.x
            attackHitbox.position.y = this.hitbox.position.y + 17
            attackHitbox.width = 60
            attackHitbox.height = 73

        } else {
            // заливка хитбокса атаки черным
            // c.fillStyle = 'black'
            // c.fillRect(player.hitbox.displayPosition.x+108, player.hitbox.displayPosition.y + 17, 60, 73)

            attackHitbox.position.x = this.hitbox.position.x + 108
            attackHitbox.position.y = this.hitbox.position.y + 17
            attackHitbox.width = 60
            attackHitbox.height = 73
        }

        ObjectManager.checkForDamage()
    }

    takeDamage(attackDirection) {
        this.preventInput = true
        // this.animationPrevent = true
        this.velocity.x = 0
        this.hp -= 1
        console.log(this.hp)

        if (attackDirection === 'left') {
            this.velocity.x -= 5
            this.switchSprite('hitLeft')
        }
        else {
            this.velocity.x += 5
            this.switchSprite('hitRight')
        }
        this.velocity.y -= 10

        // setTimeout(() => {
        //     this.velocity.x = 0
        // }, 200);
    }
}