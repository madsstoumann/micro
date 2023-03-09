export default class App {
	constructor(app, list, patterns, microNode) {
		if (app) {
			this.microNode = microNode
			this.storage = true
			this.init(app, list, patterns)
		}
	}
	add(list, name, data) {
		list.insertAdjacentHTML('beforeend', `<button type="button" data-preset='${typeof data === 'object' ? JSON.stringify(data): data}'>${name}</button>`)
	}
	init(app, list, patterns) {
		app.addEventListener('input', event => { this.set(event.target) })
		app.addEventListener('reset', event => { this.update(app) })
		if (list) this.presets(app, list, patterns)
		if (app.elements.save) { 
			app.elements.save.addEventListener('click', () => {
				const data = this.save(app)
				console.log(`%cYour JSON is ready:\n%c${data}`, 'font-weight:700', 'padding:1ch')
				if (this.storage) {
					const name = prompt('Save?') || 'Preset';
					localStorage.setItem(name, data)
					this.add(list, name, data)
				} else {
					alert('localStorage is not allowed. Check the console instead.')
				}
			})
		}
		this.update(app)
	}
	load(app, data) {
		Object.keys(data).forEach(key => app.elements[key].value = data[key])
		this.update(app)
	}
	micro(input) {
		if (this.microNode) {
			const prefix = input.name + '-';
			this.microNode.className = this.microNode.className.replace(new RegExp(`${prefix}[0-9]+`, ''), '');
			if (input.value !== '0') this.microNode.classList.add(prefix+input.value)
		}
	}
	presets(app, list, patterns = []) {
		list.addEventListener('click', event => {
			if (event.target.hasAttribute('data-preset')) this.load(app, JSON.parse(event.target.dataset.preset))
		})
		Object.keys(patterns).forEach(key => this.add(list, patterns[key].name, patterns[key].data))
		if (this.storage) Object.keys(localStorage).forEach(key => this.add(list, key, localStorage.getItem(key)))
	}
	save(app) {
		return JSON.stringify(Object.fromEntries(new FormData(app)))
	}
	scope(input, scope) {
		switch (scope) {
			case 'fieldset': return input.closest('fieldset')
			case 'form': return input.form
			case 'next': return input.nextElementSibling
			case 'parent': return input.parentNode
			case 'prev': return input.previousElementSibling
			case 'root': return document.documentElement
			default: return scope?.length ? document.querySelector(scope) : input
		}
	}
	set(input) {
		if (input?.type === 'radio') return this.micro(input)
		const key = input.dataset.key || input.name
		const node = this.scope(input, input.dataset.scope)
		if (key && node) { 
			const value = input.value + (input.dataset.unit || '')
			node.style.setProperty(key.startsWith('--') ? key : '--' + key, value)
		}
	}
	update(app) {
		if (this.microNode) return
		console.log('TODO:RESET')
		Array.from(app.elements).forEach(input => input.value && input.dispatchEvent(new Event('input', { bubbles: true })))
	}
}