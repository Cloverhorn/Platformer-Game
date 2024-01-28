class Sprite {
    constructor({ position,
        imageSrc,
        frameRate = 1,
        animations,
        frameBuffer = 13,
        loop = true,
        autoplay = true,
        scale = 1
    }) {
        this.position = position
        this.image = new Image()
        this.scale = scale

        this.image.onload = () => {
            this.loaded = true
            this.width = this.image.width / this.frameRate
            this.height = this.image.height
        }

        this.displayPosition = { ...this.position }

        this.image.src = imageSrc
        this.loaded = false
        this.frameRate = frameRate
        this.currentFrame = 0
        this.elapsedFrames = 0
        // this.frameBuffer = 13
        this.frameBuffer = frameBuffer
        // Загружаем все анимации
        this.animations = animations
        this.loop = loop
        this.autoplay = autoplay
        this.currentAnimation
        this.lastUpdate = Date.now() //Для метода updateFrames

        if (this.animations) {
            for (let key in this.animations) {
                const image = new Image()
                image.src = this.animations[key].imageSrc
                animations[key].image = image
            }

            // console.log(this.animations)
        }
    }

    draw() {

        if (!this.loaded) return
        const cropBox = {
            position: {
                x: this.width * this.currentFrame,
                y: 0
            },
            width: this.width,
            height: this.height
        }
        // c.drawImage(
        //     this.image,
        //     cropBox.position.x,
        //     cropBox.position.y,
        //     cropBox.width,
        //     cropBox.height,
        //     this.position.x,
        //     this.position.y,
        //     this.width,
        //     this.height
        // )

        c.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.displayPosition.x,
            this.displayPosition.y,
            this.width * this.scale,
            this.height * this.scale
        )

        // c.fillStyle = 'rgba(255,255,0, 0.3)'
        // c.fillRect(player.hitbox.displayPosition.x, player.hitbox.displayPosition.y, cropBox.width, cropBox.height)

        if (this.frameRate !== 1) this.updateFrames() //Не обновляем отрисовку анимации, если анимации нет (если кол-во кадров анимации = 1)
    }

    play() {
        this.autoplay = true
    }


    updateFrames() {
        const now = Date.now()
        const elapsed = now - this.lastUpdate

        // Если прошло более 1/60 секунды (примерно 16.67 мс)
        if (elapsed > 1000 / 60) {
            this.lastUpdate = now

            if (!this.autoplay) return
            this.elapsedFrames++
            if (this.elapsedFrames % this.frameBuffer === 0) {

                if (this.currentFrame < this.frameRate - 1) this.currentFrame++

                else if (this.loop === true) this.currentFrame = 0
            }

            // Если у анимации есть метод OnComplete
            if (this.currentAnimation?.onComplete) {
                // if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                if (this.currentFrame === this.frameRate - 1 && !this.currentAnimation.isActive) {
                    this.currentAnimation.onComplete()
                    this.currentAnimation.isActive = true
                }
            }
        }
    }
}