class Menu {
    constructor({ imageSrc, position }) {

        this.mainMenu = {
            newGame: {
                x: 704,
                y: 128,
                width: 192,
                height: 64,
            },
            settings: {
                x: 704,
                y: 256,
                width: 192,
                height: 64,
                clicked: false
            },
            credits: {
                x: 704,
                y: 384,
                width: 192,
                height: 64,
                clicked: false
            },
            addClickEvent: () => {
                canvas.addEventListener('click', this.mainMenu.menuEvents)
            },
            removeClickEvent: () => {
                canvas.removeEventListener('click', this.mainMenu.menuEvents)
            },
            menuEvents: (event) => {
                if (level === 0) {
                    const rect = canvas.getBoundingClientRect()
                    const x = event.clientX - rect.left
                    const y = event.clientY - rect.top

                    // Проверка, было ли нажатие внутри кнопки начать игру
                    if (x >= this.mainMenu.newGame.x && x <= this.mainMenu.newGame.x + this.mainMenu.newGame.width &&
                        y >= this.mainMenu.newGame.y && y <= this.mainMenu.newGame.y + this.mainMenu.newGame.height) {
                        gsap.to(overlay, {
                            opacity: 1,
                            onComplete: () => { //у gsap есть собственный метод onComplete
                                level++
                                if (level === 4) level = 1
                                levels[level].init()
                                player.switchSprite('idleRight')
                                player.preventInput = false
                                gsap.to(overlay, {
                                    opacity: 0,

                                })
                            }
                        })
                        this.mainMenu.removeClickEvent()
                    }
                    // Проверка, было ли нажатие внутри кнопки settings
                    if (x >= this.mainMenu.settings.x && x <= this.mainMenu.settings.x + this.mainMenu.settings.width &&
                        y >= this.mainMenu.settings.y && y <= this.mainMenu.settings.y + this.mainMenu.settings.height) {
                        console.log('Настройки')
                        this.mainMenu.settings.clicked = true
                        this.mainMenu.removeClickEvent()
                        this.settings.addClickEvent()
                    }
                    // Проверка, было ли нажатие внутри кнопки credits
                    if (x >= this.mainMenu.credits.x && x <= this.mainMenu.credits.x + this.mainMenu.credits.width &&
                        y >= this.mainMenu.credits.y && y <= this.mainMenu.credits.y + this.mainMenu.credits.height) {
                        console.log('Credits')
                        this.mainMenu.credits.clicked = true
                        this.mainMenu.removeClickEvent()
                        this.credits.addClickEvent()
                    }
                }
            }
        }

        this.settings = {
            x: 64,
            y: 64,
            width: 896,
            height: 448,
            backgroundSrc: './img/settingsBackground.png',
            exit: {
                x: 880,
                y: 70,
                width: 64,
                height: 64
            },
            collisions: {
                x: 99,
                y: 153,
                width: 26,
                height: 24,
                clicked: false
            },
            addClickEvent: () => {
                canvas.addEventListener('click', this.settings.menuEvents)
            },
            removeClickEvent: () => {
                canvas.removeEventListener('click', this.settings.menuEvents)
            },
            menuEvents: (event) => {
                const rect = canvas.getBoundingClientRect()
                const x = event.clientX - rect.left
                const y = event.clientY - rect.top

                // Проверка нажатия на выход из меню
                if (x >= this.settings.exit.x && x <= this.settings.exit.x + this.settings.exit.width &&
                    y >= this.settings.exit.y && y <= this.settings.exit.y + this.settings.exit.height) {

                    this.mainMenu.settings.clicked = false
                    this.settings.removeClickEvent()
                    this.mainMenu.addClickEvent()
                }

                // Проверка включения настройки коллизий
                if (x >= this.settings.collisions.x && x <= this.settings.collisions.x + this.settings.collisions.width &&
                    y >= this.settings.collisions.y && y <= this.settings.collisions.y + this.settings.collisions.height) {
                    if (this.settings.collisions.clicked) {
                        this.settings.collisions.clicked = false
                        settings.collisions = false
                    }
                    else {
                        this.settings.collisions.clicked = true
                        settings.collisions = true
                    }
                }
            }
        }

        this.credits = {
            x: 64,
            y: 64,
            width: 896,
            height: 448,
            backgroundSrc: './img/credits.png',
            exit: {
                x: 880,
                y: 70,
                width: 64,
                height: 64
            },
            addClickEvent: () => {
                canvas.addEventListener('click', this.credits.menuEvents)
            },
            removeClickEvent: () => {
                canvas.removeEventListener('click', this.credits.menuEvents)
            },
            menuEvents: (event) => {
                const rect = canvas.getBoundingClientRect()
                const x = event.clientX - rect.left
                const y = event.clientY - rect.top

                // Проверка нажатия на выход из меню
                if (x >= this.credits.exit.x && x <= this.credits.exit.x + this.credits.exit.width &&
                    y >= this.credits.exit.y && y <= this.credits.exit.y + this.credits.exit.height) {

                    this.mainMenu.credits.clicked = false
                    this.credits.removeClickEvent()
                    this.mainMenu.addClickEvent()
                }
            }
        }

        // Credits
        this.creditsMenu = new Image()
        this.creditsMenu.src = this.credits.backgroundSrc
        // Меню настроек
        this.subMenuImage = new Image()

        // this.subMenuImage.onload = () => {
        //     this.subMenuImageLoaded = true
        //     this.subMenuImage.width = this.settings.width
        //     this.subMenuImage.height = this.settings.height
        // }

        this.subMenuImage.src = this.settings.backgroundSrc
        this.subMenuImageLoaded = false


        // Свойства
        this.image = new Image()
        this.image.onload = () => {
            this.loaded = true
            this.width = this.image.width
            this.height = this.image.height
        }
        this.image.src = imageSrc
        this.loaded = false
        this.position = position
    }

    draw() {
        if (!this.loaded) return
        const cropBox = {
            position: {
                x: 0,
                y: 0
            },
            width: this.width,
            height: this.height
        }

        c.drawImage(
            this.image,
            cropBox.position.x,
            cropBox.position.y,
            cropBox.width,
            cropBox.height,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        )

        if (this.mainMenu.settings.clicked) {
            // c.fillStyle = 'rgba(28, 155, 54, 0.8)'
            // c.fillRect(this.settings.x, this.settings.y, this.settings.width, this.settings.height)
            c.drawImage(this.subMenuImage, this.settings.x, this.settings.y, this.settings.width, this.settings.height)

            if (this.settings.collisions.clicked) {
                c.fillStyle = 'white'
                c.fillRect(99, 153, 26, 24)
            }
        }

        if (this.mainMenu.credits.clicked) {
            c.drawImage(this.creditsMenu, this.settings.x, this.settings.y, this.settings.width, this.settings.height)
        }
    }
}