// max: 62 characters
let characters = 0
let invisibleBackspace = `<div style="display: none;" class="character"> </div>`

function handleMovement() {
    if (characters < 0) characters = 0

    let line = ((characters - (characters % 62)) / 62)
    document.querySelector('div.caret').style.transform = `translate(${(characters % 62) * 0.8}rem, ${(line > 8 ? 8 : line) * 1.3}em)`
}

function key(k) {
    characters++
    handleMovement()

    return `<div class="character">${k}</div>`
}

document.onkeydown = ((e) => {
    if (!e.ctrlKey && !e.metaKey) {
        if (e.key.length === 1 || e.key.includes(' ')) {
            if (e.key.includes(' ') && characters % 62 === 0) document.querySelector('div.words').innerHTML += invisibleBackspace
            else document.querySelector('div.words').innerHTML += key(e.key)
        } else if (e.key === 'Backspace' && characters > 0) {
            let text = document.querySelector('div.words').innerHTML
            document.querySelector('div.words').innerHTML = text.substring(0, text.length - 30)
            if (!text.endsWith(invisibleBackspace)) characters--
            handleMovement()
        }
    } else if (e.ctrlKey && e.key === 'Backspace') {
        let text = document.querySelector('div.words').innerHTML
        while (!text.endsWith(`<div class="character"> </div>`) && text !== "") {
            if (!text.endsWith(invisibleBackspace)) characters--
            handleMovement()
            document.querySelector('div.words').innerHTML = text.substring(0, text.length - 30)
            text = document.querySelector('div.words').innerHTML
        }

        characters--
        document.querySelector('div.words').innerHTML = text.substring(0, text.length - 30)
        handleMovement()
    }
})

document.querySelector('div.words').innerHTML = (localStorage.getItem('text') || '').split('').map((e) => key(e)).join('')

function time() {
    return +new Date()
}

let wipe = false

setInterval(() => {
    if (!wipe) localStorage.setItem('text', document.querySelector('div.words').innerHTML.replaceAll(' style="display: none;"', '').replaceAll(/<div class="character">.<\/div>/g, (e) => e[23]))
    let list = document.querySelector('div.words').querySelectorAll('div.character')
    list[list.length - 1]?.scrollIntoView()
})

document.querySelector('span.wipe').onclick = ((e) => {
    wipe = true
    localStorage.setItem('text', '')
    location.reload()
})

function showBox() {
    wipe = true
    characters = 0
    document.querySelector('div.words').innerHTML = ''
    handleMovement()

    let text = 'This is a website inspired by monkeytype.com aimed to provide a relaxing experience as you type down your thoughts. The original concept was made when the creator, agent z thought that the zen mode feature of monkeytype needed a bit more work to add more features. The website is intended to be used as a type of diary of some sorts... (reload the page to retrieve your written text!)'.split('')
    setInterval(() => {
        if(text.length != 0) {
            document.querySelector('div.words').innerHTML += key(text[0])
            text.splice(0, 1)
        }
    }, 40)
}