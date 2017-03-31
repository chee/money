const Component = require('inferno-component')
const Question = require('../components/Question')
const Info = require('../components/Info')
const h = require('inferno-hyperscript')

Date.prototype.startDay = function() {
	this.setHours(1)
	this.setMinutes(0)
	this.setSeconds(0)
	return this
}

const START = 'start'
const MONEY = 'money'
const DAYS = 'days'
const INFO = 'info'
const STEP = 'step'
const BUDGET = 'budget'
const SPENT = 'spent'

const questions = {
	[MONEY]: 'how much money you got to spned?',
	[DAYS]: 'hwo long do you have to spend it?'
}

const day = 60 * 60 * 24 * 1000

class Application extends Component {
	constructor(props) {
		super(props)
		this.state = {
			start: localStorage.getItem(START) || (new Date).startDay(),
			money: localStorage.getItem(MONEY),
			days: localStorage.getItem(DAYS),
			step: localStorage.getItem(STEP) || MONEY,
			spending: null,
			spent: localStorage.getItem(SPENT) || 0,
		}
		const {days, money, spent, start} = this.state
		const budget = localStorage.getItem(BUDGET)
		this.state.budget = budget
			? JSON.parse(budget)
			: [...Array(+days)].map(() => (money - spent) / days)
		localStorage.setItem(BUDGET, JSON.stringify(this.state.budget))
		this.state.day = ((new Date).startDay() - start) / day | 0
		const functions = ['restart', 'change', 'submit', 'spend']
		functions.forEach(func => this[func] = this[func].bind(this))
	}

	componentDidUpdate() {
		const {start, day} = this.state
		const newDay = ((new Date).startDay() - start) / day | 0
		if (newDay == day) return
		this.setState({
			day: newDay
		})
	}

	restart() {
		this.setState({
			start: (new Date).startDay(),
			money: null,
			days: null,
			step: MONEY,
			spending: null,
			spent: 0
		})
		localStorage.removeItem(START)
		localStorage.removeItem(MONEY)
		localStorage.removeItem(MONEY)
		localStorage.removeItem(STEP)
		localStorage.removeItem(SPENT)
		localStorage.removeItem(BUDGET)
	}

	change({target: {value}}) {
		const {step} = this.state
		if (step == MONEY) return this.setState({
			money: value
		})
		if (step == DAYS) return this.setState({
			days: value
		})
		if (step == INFO) return this.setState({
			spending: value
		})
	}

	submit() {
		const {step, money, spent, days, start} = this.state
		localStorage.setItem(step, this.state[step])

		if (step == MONEY) {
			this.setState({[STEP]: DAYS})
			localStorage.setItem(STEP, DAYS)
		}
		if (step == DAYS) {
			this.setState({
				step: INFO,
				budget: [...Array(days)].map(() => (money - spent) / days),
				day: ((new Date).startDay() - start) / day | 0
			}, () => {
				localStorage.setItem(BUDGET, JSON.stringify(this.state.budget))
			})
			localStorage.setItem(STEP, INFO)
		}
	}

	spend() {
		const {day, budget, spending, spent} = this.state
		const newBudget = [...budget]
		newBudget[day] -= spending
		this.setState({
			spending: null,
			budget: newBudget,
			spent: +spent + +spending
		}, () => {
			localStorage.setItem(BUDGET, JSON.stringify(newBudget))
			localStorage.setItem(SPENT, this.state.spent)
		})
	}

	render() {
		const {step} = this.state
		return (
			step == INFO ? h(Info, Object.assign({}, this.state, {
				restart: this.restart,
				spend: this.spend,
				change: this.change
			})) : (
				h(Question, {
					submit: this.submit,
					change: this.change,
					question: questions[step],
					answer: this.state[step],
					restart: this.restart
				})
			)
		)
	}
}

module.exports = Application
