class Pig extends Player {
    constructor({
        patrolSize = 150,
        position,
        imageSrc = './img/pig/idle.png',
        frameRate = 11, frameBuffer = 5,
        loop = true, scale = 2,
        animations = {
            hit: {
                frameRate: 2,
                frameBuffer: 15,
                loop: false,
                imageSrc: './img/pig/hit.png',
                onComplete: () => {
                    pigTest.switchSprite('idle')
                    pigTest.currentAnimation.isActive = false
                }
            },
            idle: {
                frameRate: 11,
                frameBuffer: 5,
                loop: true,
                imageSrc: './img/pig/idle.png'
            },
            dead: {
                frameRate: 4,
                frameBuffer: 18,
                loop: false,
                imageSrc: './img/pig/dead.png',
                onComplete: () => {
                    console.log('dead')
                    this.animationPrevent = true
                    this.alive = false
                }
            },
            runLeft: {
                frameRate: 6,
                frameBuffer: 6,
                loop: true,
                imageSrc: './img/pig/run.png'
            },
            runRight: {
                frameRate: 6,
                frameBuffer: 6,
                loop: true,
                imageSrc: './img/pig/runRight.png'
            },
            attackLeft: {
                frameRate: 5,
                frameBuffer: 4,
                loop: false,
                imageSrc: './img/pig/attackLeft.png',
                onComplete: () => {
                    this.switchSprite('idle')
                }
            },
            attackRight: {
                frameRate: 5,
                frameBuffer: 4,
                loop: false,
                imageSrc: './img/pig/attackRight.png',
                onComplete: () => {
                    this.switchSprite('idle')
                }
            },
        },
        level
    }) {
        super({ position, imageSrc, frameRate, frameBuffer, loop, scale, animations })
        this.hp = 2
        this.alive = true

        this.start = {
            position: { ...this.position }
        }

        this.patrolArea = {
            positionStart: {
                x: this.start.position.x - patrolSize,
                y: this.start.position.y
            },
            positionEnd: {
                x: this.start.position.x + patrolSize,
                y: this.start.position.y
            }
        }
        this.aggresive = false
        this.level = level
        this.commandsQueue = []
        this.executing = false

    }

    update() {
        // if (!this.hp < 0) return
        this.hpCheck()
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

        this.updateDisplayPosition()

        this.commandHandler()
        // this.executeCommand()
        this.patrol()

        this.checkForAttack()

        // Заливка картинки свинтуса
        // c.fillStyle = 'rgba(255, 255,0, 0.3)'
        // c.fillRect(this.displayPosition.x, this.displayPosition.y, this.width * this.scale, this.height * this.scale)
        // // // Заливка displayPos хитбокса
        // c.fillStyle = 'rgba(255, 0,0, 0.3)'
        // c.fillRect(this.hitbox.displayPosition.x, this.hitbox.displayPosition.y, this.hitbox.width, this.hitbox.height)
    }

    updateHitbox() {
        this.hitbox = {
            position: {
                // Корректировка позиции хитбокса на экране
                x: this.position.x + 30, // новое значение
                y: this.position.y + 16  // новое значение
            },
            displayPosition: {
                // Хитбокс смещается относительно координат картинки свина
                x: this.displayPosition.x + 19,
                y: this.displayPosition.y + 16
            },
            width: 40,  // новое значение
            height: 40, // новое значение
            log: 'новое значение' // новое значение
        }
    }

    takeDamage() {
        if (attackHitbox.position.x < this.position.x + 80) this.velocity.x += 1.5
        else this.velocity.x -= 1.5
        this.switchSprite('hit')
        this.velocity.y -= 10
        this.hp -= 1
        console.log(this.hp)

        setTimeout(() => {
            this.velocity.x = 0
        }, 200);
    }

    hpCheck() {
        if (this.hp <= 0) {
            this.switchSprite('dead')
            this.attackPrevent = true
        }
    }

    checkForAttack() {
        if (this.attackPrevent) return
        c.fillStyle = 'black'
        // c.fillRect(player.hitbox.displayPosition.x+108, player.hitbox.displayPosition.y + 17, 60, 73)
        // c.fillRect(this.hitbox.displayPosition.x - 20, this.hitbox.displayPosition.y, 30, 43)
        // c.fillRect(this.hitbox.displayPosition.x + 30, this.hitbox.displayPosition.y, 30, 43)

        if (player.hitbox.displayPosition.x + 58 + player.hitbox.width > this.hitbox.displayPosition.x - 17 &&
            player.hitbox.displayPosition.x + 58 < this.hitbox.displayPosition.x + 7 &&
            player.hitbox.displayPosition.y + player.hitbox.height > this.hitbox.displayPosition.y &&
            player.hitbox.displayPosition.y < this.hitbox.displayPosition.y + this.hitbox.height

        ) {

            this.switchSprite('attackLeft')
            this.attackPrevent = true
            player.takeDamage('left')
            setTimeout(() => {
                this.attackPrevent = false
            }, 1000)
            return
        }

        if (player.hitbox.displayPosition.x + 58 < this.hitbox.displayPosition.x + 27 &&
            player.hitbox.displayPosition.x + 58 + player.hitbox.width > this.hitbox.displayPosition.x + 30 &&
            player.hitbox.displayPosition.y + player.hitbox.height > this.hitbox.displayPosition.y &&
            player.hitbox.displayPosition.y < this.hitbox.displayPosition.y + this.hitbox.height
        ) {
            this.switchSprite('attackRight')
            this.attackPrevent = true
            player.takeDamage('right')
            setTimeout(() => {
                this.attackPrevent = false
            }, 1000)
            return
        }
    }

    // Поведение свина
    commandHandler() {
        if (this.aggresive) return

        if (this.velocity.x === 0) {
            this.addCommandToQueue(this.runLeft)
        }

        if (this.position.x === this.patrolArea.positionStart.x) {
            this.addCommandToQueue(this.runRight)
        }
        if (this.position.x === this.patrolArea.positionEnd.x) {

            this.addCommandToQueue(this.runLeft)
        }
    }

    patrol() {
        if (this.hp <= 0) return

        if (this.velocity.x === 0) {
            this.velocity.x = 0
            this.switchSprite('runLeft')
            this.velocity.x -= 1
            this.lastDirection = 'left'
        }

        if (this.position.x === this.patrolArea.positionStart.x) {

            this.velocity.x = 0
            this.switchSprite('runRight')
            this.velocity.x += 1
            this.lastDirection = 'right'
        }
        if (this.position.x === this.patrolArea.positionEnd.x) {

            this.velocity.x = 0
            this.switchSprite('runLeft')
            this.velocity.x -= 1
            this.lastDirection = 'left'
        }
    }

    runLeft() {
        this.velocity.x = 0
        this.switchSprite('runLeft')
        this.velocity.x -= 1
        this.lastDirection = 'left'
    }

    runRight() {
        this.velocity.x = 0
        this.switchSprite('runRight')
        this.velocity.x += 1
        this.lastDirection = 'right'
    }

    addCommandToQueue(command) {
        this.commandsQueue.push(command.bind(this))
    }

    executeCommand() {
        if (this.executing === true || this.commandsQueue.length === 0) return
        //bind(this) нужен, чтобы метод вызывался с привязкой к контексту класса, чтобы при вызове this ссылался на нужный экземпляр класса
        // this.commandsQueue.push(this.runLeft.bind(this)) 
        const command = this.commandsQueue.shift()
        this.executing = true
        command()
        this.executing = false
    }
}