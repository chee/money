const render = require('inferno').render
const Money = require('./containers/Money')
const h = require('inferno-hyperscript')

let tick = 0
setInterval(() => tick += 1, 1000)

render(h(Money, {tick}), document.getElementById('app'))
