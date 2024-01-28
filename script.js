const canvas = document.querySelector('#game-window')
const c = canvas.getContext('2d')

canvas.width = 64 * 16
canvas.height = 64 * 9

let parsedCollisions
let collisionBlocks
let background
let doors = []
let pigs = []

let settings = {
    collisions: false
}

let attackHitbox = {
    position: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0
}

let pigAttackHitbox = {
    position: {
        x: 0,
        y: 0
    },
    width: 0,
    height: 0
}

// const pigTest = ObjectManager.createObject(Pig, {
//     position: {
//         x: 600,
//         y: 250
//     },
//     level: 1
    // imageSrc: './img/pig/idle.png',
    // frameRate: 11,
    // frameBuffer: 5,
    // loop: true,
    // scale: 2,
    // animations: {
    //     hit: {
    //         frameRate: 2,
    //         frameBuffer: 15,
    //         loop: false,
    //         imageSrc: './img/pig/hit.png',
    //         onComplete: () => {
    //             pigTest.switchSprite('idle')
    //             pigTest.currentAnimation.isActive = false
    //         }
    //     },
    //     idle: {
    //         frameRate: 11,
    //         frameBuffer: 5,
    //         loop: true,            
    //         imageSrc: './img/pig/idle.png'
    //     },
    //     dead: {
    //         frameRate: 4,
    //         frameBuffer: 30,
    //         loop: false,
    //         imageSrc: './img/pig/dead.png',
    //         onComplete: () => {
    //             console.log('dead')
    //             pigTest.animationPrevent = true
    //             pigTest.alive = false
    //         }
    //     },
    //     runLeft: {
    //         frameRate: 6,
    //         frameBuffer: 6,
    //         loop: true,
    //         imageSrc: './img/pig/run.png'
    //     },
    //     runRight: {
    //         frameRate: 6,
    //         frameBuffer: 6,
    //         loop: true,
    //         imageSrc: './img/pig/runRight.png'
    //     },
    //     attackLeft: {
    //         frameRate: 5,
    //         frameBuffer: 4,
    //         loop: false,
    //         imageSrc: './img/pig/attackLeft.png',
    //         onComplete: () => {
    //             pigTest.switchSprite('idle')
    //         }
    //     },
    //     attackRight: {
    //         frameRate: 5,
    //         frameBuffer: 4,
    //         loop: false,
    //         imageSrc: './img/pig/attackRight.png',
    //         onComplete: () => {
    //             pigTest.switchSprite('idle')
    //         }
    //     },
    // }
// })





const player = ObjectManager.createObject(Player, {
    imageSrc: './img/king/idle.png',
    frameRate: 11,
    // frameBuffer: myFps / frameRate,
    frameBuffer: 5,
    loop: true,
    animations: {
        idleRight: {
            frameRate: 11,
            // frameBuffer: 13, 
            frameBuffer: 5, 
            loop: true,
            imageSrc: './img/king/idle.png',
        },
        idleLeft: {
            frameRate: 11,
            frameBuffer: 5,
            loop: true,
            imageSrc: './img/king/idleLeft.png',
        },
        runRight: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runRight.png',
        },
        runLeft: {
            frameRate: 8,
            frameBuffer: 4,
            loop: true,
            imageSrc: './img/king/runLeft.png',
        },
        enterDoor: {
            frameRate: 8,
            frameBuffer: 6,
            loop: false,
            imageSrc: './img/king/enterDoor.png',
            onComplete: () => {
                gsap.to(overlay, {
                    opacity: 1,
                    onComplete: () => { //у gsap есть собственный метод onComplete
                        level++
                        // if (level === 4) level = 1
                        levels[level].init()
                        player.switchSprite('idleRight')
                        player.preventInput = false
                        gsap.to(overlay, {
                            opacity: 0,
                        })
                    }
                })
            },
        },
        attack: {
            frameRate: 3,
            frameBuffer: 6,
            loop: false,
            imageSrc: './img/king/attack2.png',
            onComplete: () => {
                attackHitbox.position.x = attackHitbox.position.y = 0
                player.animationPrevent = false
                if (this.currentAnimation.isActive) this.currentAnimation.isActive = false
            }
        },
        attackLeft: {
            frameRate: 3,
            frameBuffer: 6,
            loop: false,
            imageSrc: './img/king/attackLeft.png',
            onComplete: () => {
                attackHitbox.position.x = attackHitbox.position.y = 0
                player.animationPrevent = false
                if (this.currentAnimation.isActive) this.currentAnimation.isActive = false
            }
        },
        hitLeft: {
            frameRate: 2,
            frameBuffer: 18,
            loop: false,
            imageSrc: './img/king/hitLeft.png',
            onComplete: () => {
                player.switchSprite('idleLeft')
                setTimeout(() => {
                    player.preventInput = false   
                    player.animationPrevent = false     
                }, 200);
            }
        },
        hitRight: {
            frameRate: 2,
            frameBuffer: 18,
            loop: false,
            imageSrc: './img/king/hitRight.png',
            onComplete: () => {
                player.switchSprite('idleLeft')
                setTimeout(() => {
                    player.preventInput = false 
                    player.animationPrevent = false    
                }, 200);
            }
        }
    }
})



let level = 0
let levels = {
    0: { 
        init: () => {
            background = new Menu({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/Menu2.png'
            })  
            
            background.mainMenu.addClickEvent()
            
            player.setPosition({
                position: {
                    x: -4000,
                    y: -4000
                }
            })
        }

    },
    1: {
        init: () => {
            
            parsedCollisions = collissionsLevel1.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.isCentered = false

            player.setPosition({
                position: {
                    x: 200,
                    y: 200
                }
            })

            if (player.currentAnimation) player.currentAnimation.isActive = false

            background = ObjectManager.createObject(Sprite, {
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel1.png'
            })

            doors = [
                ObjectManager.createObject(Sprite, {
                    position: {
                        x: 766,
                        y: 272
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 6,
                    loop: false,
                    autoplay: false
                })
            ]
            
            const pig = ObjectManager.createObject(Pig, {
                position: {
                    x: 600,
                    y: 250
                },
                level: 1})
                
            pig.collisionBlocks = collisionBlocks
            player.isCentered = false

        }
    },
    2: {
        init: () => {

            parsedCollisions = collissionsLevel2.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.isCentered = false
            
            // player.position.x = 96
            // player.position.y = 140
            player.setPosition({
                position: {
                    x: 96,
                    y: 105
                }
            })

            if (player.currentAnimation) player.currentAnimation.isActive = false

            background = ObjectManager.createObject(Sprite, {
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel2.png'
            })

            doors = [
                ObjectManager.createObject(Sprite, {
                    position: {
                        x: 772,
                        y: 334
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 6,
                    loop: false,
                    autoplay: false
                })
            ]

            const pig = ObjectManager.createObject(Pig, {
                position: {
                    x: 450,
                    y: 420
                },
                level: 2,
                patrolSize: 75
            })
                
            pig.collisionBlocks = collisionBlocks
            player.isCentered = false
        }
    },
    3: {
        init: () => {

            parsedCollisions = collissionsLevel3.parse2D()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
            player.isCentered = false

            if (player.currentAnimation) player.currentAnimation.isActive = false

            // player.position.x = 757
            // player.position.y = 230
            player.setPosition({
                position: {
                    x: 757,
                    y: 230
                }
            })
            background = ObjectManager.createObject(Sprite, {
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel3.png'
            })

            doors = [
                ObjectManager.createObject(Sprite, {
                    position: {
                        x: 176,
                        y: 334
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 6,
                    loop: false,
                    autoplay: false
                })
            ]

            const pig = ObjectManager.createObject(Pig, {
                position: {
                    x: 420,
                    y: 360
                },
                level: 3})
                
            pig.collisionBlocks = collisionBlocks
            player.isCentered = false
        }
    },
    4: {
        init: () => {

            parsedCollisions = collissionsLevel4.parse2Dnew()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks

            if (player.currentAnimation) player.currentAnimation.isActive = false
            
            player.setPosition({
                position: {
                    x: 512,
                    y: 200
                }
            })

            background = ObjectManager.createObject(Sprite, {
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel4.png'
            })

            doors = [
                ObjectManager.createObject(Sprite, {
                    position: {
                        x: 1664,
                        y: 850
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 6,
                    loop: false,
                    autoplay: false
                })
            ]
            const pig = ObjectManager.createObject(Pig, {
                position: {
                    x: 1260,
                    y: 295
                },
                level: 4
            })                
            pig.collisionBlocks = collisionBlocks

            const pig2 = ObjectManager.createObject(Pig, {
                position: {
                    x: 290,
                    y: 615
                },
                level: 4,
            patrolSize: 100
            })                
            pig2.collisionBlocks = collisionBlocks

            const pig3 = ObjectManager.createObject(Pig, {
                position: {
                    x: 1270,
                    y: 870
                },
                level: 4,
            patrolSize: 200
            })                
            pig3.collisionBlocks = collisionBlocks
            player.isCentered = false
        }
    },
    5: {
        init: () => {
            parsedCollisions = collissionsLevel5.parse2Dnew()
            collisionBlocks = parsedCollisions.createObjectsFrom2D()
            player.collisionBlocks = collisionBlocks
    
            if (player.currentAnimation) player.currentAnimation.isActive = false
    
    
            background = ObjectManager.createObject(Sprite, {
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/backgroundLevel5.png'
            })
            
            player.setPosition({
                position: {
                    x: 280,
                    y: 870
                }
            })
    
            doors = [
                ObjectManager.createObject(Sprite, {
                    position: {
                        x: 380,
                        y: 274
                    },
                    imageSrc: './img/doorOpen.png',
                    frameRate: 5,
                    frameBuffer: 6,
                    loop: false,
                    autoplay: false
                })
            ]
            const pig = ObjectManager.createObject(Pig, {
                position: {
                    x: 1260,
                    y: 870
                },
                level: 5
            })                
            pig.collisionBlocks = collisionBlocks

            const pig2 = ObjectManager.createObject(Pig, {
                position: {
                    x: 1263,
                    y: 615
                },
                level: 5,
            })                
            pig2.collisionBlocks = collisionBlocks

            const pig3 = ObjectManager.createObject(Pig, {
                position: {
                    x: 785,
                    y: 487
                },
                level: 5,
                patrolSize: 75
            })                
            pig3.collisionBlocks = collisionBlocks            
            player.isCentered = false
        }
    },
    6: {
        init: () => {
            background = new Menu({
                position: {
                    x: 0,
                    y: 0
                },
                imageSrc: './img/end.png'
            })  
            
            
            player.setPosition({
                position: {
                    x: -4000,
                    y: -4000
                }
            })
            doors = []
        }
    }
}

const keys = {
    w: {
        pressed: false
    },
    a: {
        pressed: false
    },
    s: {
        pressed: false
    },
    d: {
        pressed: false
    },
    k: {
        pressed: false
    }
}


const overlay = {
    opacity: 0
}


function animate() {

    window.requestAnimationFrame(animate)
    console.log(player.position)
    // Отрисовка фона, должна быть вначале
    c.fillStyle = 'rgb(63,56,80)'
    c.fillRect(0,0, canvas.width, canvas.height)
    background.draw()
    
    player.centerCamera()
    // Обработка ввода
    player.handleInput(keys)

    // Отрисовка дверей
    doors.forEach(door => {
        door.draw()
    })

    // Отрисовка и обновление игрока
    player.draw()
    // Выносим отрисовку коллизий в отдельный метод, т.к. оне не отрисовывает, если он не в requestAnimationFrame
    player.drawCollisions()

    ObjectManager.pigs.forEach((elem) => {
        if(elem.alive === true && elem.level === level) {
            elem.draw()    
            elem.update()
        }
    })

    // Заливка хитбокса желтым
    // c.fillStyle = 'rgba(255,255,0, 0.3)'
    // c.fillRect(player.hitbox.displayPosition.x+58, player.hitbox.displayPosition.y+35, player.hitbox.width, player.hitbox.height)

    c.save()
    c.globalAlpha = overlay.opacity
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    c.restore()

    // Отрисовка блоков коллизии
    if (!settings.collisions) return
    player.collisionBlocks.forEach(collisionBlock => {
        collisionBlock.draw()
    })

    // Отрисовывать игрока с фоном с разной частотой не вариант, т.к. игрок некорректно отображается

}

setInterval(() => {
    player.update()
}, 1000 / 60)


levels[level].init()
animate()


// const getFPS = () =>
//     new Promise(resolve =>
//         requestAnimationFrame(t1 =>
//             requestAnimationFrame(t2 => resolve(1000 / (t2 - t1)))
//         )
//     );

// // Вызов функции, чтобы разрешить промисЮ который возвращает getFPS
// (async function () {
//     myFps = Math.ceil(await getFPS())
//     // Весь код, который должен быть выполнен после получения FPS, должен быть здесь
    
//     Promise.resolve().then(animate)
//     console.log(myFps)
// })();

// // Потом удалить
// console.log(myFps + ' ФПС')