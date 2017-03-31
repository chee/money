const h = require('inferno-hyperscript')

module.exports = ({question, answer, change, submit, restart}) => {
	return (
		h('.question', null, [
			h('p.question-question', question),
			h('input.question-input', {
				value: answer,
				onInput: change,
				type: 'number'
			}),
			h('button.question-button go', {onClick: submit}, '🙃'),
			h('button.question-button fuck', {onClick: restart}, '🚮')
		])
	)
}
