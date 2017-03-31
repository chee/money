const h = require('inferno-hyperscript')

const round = (value, decimals) => (
  Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
)

module.exports = ({money, restart, change, spending, spend, spent, budget, day}) => {
	return (
		h('.info', null, [
			h('p.info-lead', 'you have'),
			h('p.info-number', {
				className: budget[day] <= 0 && 'bad'
			}, round(budget[day], 2)),
			h('p.info-tail', 'that you havent spent'),
			h('div', null, [
				h('input.info-input', {value: spending, type: 'number', onInput: change}),
				h('button.info-button.go', {onClick: spend}, '🌭')
			]),
			h('button.info-button.fuck', {onClick: restart}, '🚮'),
			h('div.info-further', null, [
				h('p', 'total spent: ' + round(spent, 2)),
				h('p', 'remaining in total: ' + round(money - spent, 2))
			])
		])
	)
}
