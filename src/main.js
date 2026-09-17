import { initApp } from './app.js'
import { mountIntro } from './intro.js'

initApp(document.querySelector('#app'))
const root = document.querySelector('#app')
const replay = document.createElement('button')
replay.className = 'dream-replay'
replay.textContent = 'Revivre le rêve ↗'
replay.addEventListener('click', () => mountIntro(root, { force: true }))
root.querySelector('footer').append(replay)
mountIntro(root, { force: new URLSearchParams(location.search).get('intro') === 'replay' })
