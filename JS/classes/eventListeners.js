window.addEventListener('keydown', (e) => {
    if (player.preventInput) return
    // console.log(e)
    switch (e.code) {
        case 'KeyW':
            // Проверяем коллизию с дверьми
            for (let i = 0; i < doors.length; i++) {
                const door = doors[i]
                if (player.hitbox.position.x + player.hitbox.width <= door.position.x + door.width &&
                    player.hitbox.position.x >= door.position.x &&
                    player.hitbox.position.y + player.hitbox.height >= door.position.y &&
                    player.hitbox.position.y <= door.position.y + door.height) {

                    player.velocity.x = 0
                    player.velocity.y = 0
                    player.preventInput = true
                    player.lastDirection = 'up'
                    player.switchSprite('enterDoor')
                    door.play()
                    return
                }
            }
            // Прыжок
            // if (player.velocity.y === 0 && player.isCollisionVertical) {
            //     player.velocity.y = -12
            // }
            keys.w.pressed = true
                
            break
        case 'KeyA':
            // Влево
            keys.a.pressed = true
            break
        case 'KeyD':
            // Вправо
            keys.d.pressed = true
            break
        case 'KeyS':
            // Вниз?
            break
        case 'KeyK':
            keys.k.pressed = true
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'KeyA':
            // Влево
            keys.a.pressed = false
            break
        case 'KeyD':
            // Вправо
            keys.d.pressed = false
            break
        case 'KeyS':
            // Вниз?
            break
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyK':
            keys.k.pressed = false
            break
    }
})

// Для свина
window.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowRight':
            pigTest.velocity.x += 1
            break
        case 'ArrowLeft':
            pigTest.velocity.x -= 1
            break
        case 'ArrowUp':
            pigTest.velocity.y = -12
            break
    }
})

window.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowRight':
            pigTest.velocity.x += 0
            break
        case 'ArrowLeft':
            pigTest.velocity.x -= 0
            break
    }
})


// canvas.addEventListener('click', (event) => {
//     if (level === 0) {
//         const rect = canvas.getBoundingClientRect()
//         const x = event.clientX - rect.left
//         const y = event.clientY - rect.top
    
//         // Проверка, было ли нажатие внутри кнопки
//         if (x >= background.buttons.newGame.x && x <= background.buttons.newGame.x + background.buttons.newGame.width &&
//             y >= background.buttons.newGame.y && y <= background.buttons.newGame.y + background.buttons.newGame.height) {
//             console.log('Начать игру')
//             gsap.to(overlay, {
//                 opacity: 1,
//                 onComplete: () => { //у gsap есть собственный метод onComplete
//                     level++
//                     if (level === 4) level = 1
//                     levels[level].init()
//                     player.switchSprite('idleRight')
//                     player.preventInput = false
//                     console.log(level)
//                     gsap.to(overlay, {
//                         opacity: 0,

//                     })
//                 }
//             })
//         }

//         if (x >= background.buttons.settings.x && x <= background.buttons.settings.x + background.buttons.settings.width &&
//             y >= background.buttons.settings.y && y <= background.buttons.settings.y + background.buttons.settings.height) {
//             console.log('Настройки')
//             background.settings.clicked = true
//             background.settings.addClickEvent()
//         }

//         if (x >= background.buttons.credits.x && x <= background.buttons.credits.x + background.buttons.credits.width &&
//             y >= background.buttons.credits.y && y <= background.buttons.credits.y + background.buttons.credits.height) {
//             console.log('Credits')
//             background.credits.clicked = true
//         }
//     }
// })