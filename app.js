/**
 * @class
 * @classdesc App, sets CSS Custom Properties from form inputs
 * @version 1.1.00
 * @summary 03-10-2022
 * @author Mads Stoumann
 * @param {Node} app
 * @param {Object} settings
 */
export default class App {
	constructor(app, settings = {}) {
		if (!app) return;
		this.settings = Object.assign({
			classNode: '',
			listNode: '',
			presets: [],
			storage: ''
		}, settings) 
		this.init(app)
	}
	/**
	 * @function add
	 * @description Adds a preset to the list of presets
	 * @param {Node} list
	 * @param {String} name
	 * @param {String|Object} data
	 */
	add(list, name, data) {
		const option = document.createElement('option')
		option.value = typeof data === 'object' ? JSON.stringify(data): data
		option.textContent =  name.replaceAll('-', ' ').replace(this.settings.storage, '').trim()
		list.appendChild(option)
	}
	/**
	 * @function classes
	 * @description Adds/removes a micro-class to `classNode` based on the value of the radio input
	 * @param {Node} input
	 */
	classes(input) {
		const prefix = input.name + '-';
		this.settings.classNode.className = this.settings.classNode.className.replace(new RegExp(`${prefix}[0-9]+`, ''), '');
		if (input.value !== '0') this.settings.classNode.classList.add(prefix+input.value)
	}
	/**
	 * @function init
	 * @description Initializes the app
	 * @param {Node} app
	 */
	init(app) {
		app.addEventListener('input', event => { this.set(event.target) })
		app.addEventListener('reset', (event) => { setTimeout(() => this.update(app), 50) })
		if (this.settings.listNode) this.list(app, this.settings.listNode, this.settings.presets)
		if (app.elements.save) { 
			app.elements.save.addEventListener('click', () => {
				const data = this.save(app)
				console.log(`%cJSON:\n%c${data}`, 'font-weight:700', 'padding:1ch')
				if (this.settings.storage) {
					const name = prompt('Save?') || 'Preset';
					localStorage.setItem((this.settings.storage || 'app') + '-' + name.replaceAll(' ', '-') , data)
					this.add(list, name, data)
				}
			})
		}
		this.update(app)
	}
	/**
	 * @function load
	 * @description Loads a preset
	 * @param {Node} app
	 * @param {Object} data
	 */
	load(app, data) {
		Object.keys(data).forEach(key => app.elements[key].value = data[key])
		this.update(app)
	}
	/**
	 * @function list
	 * @description Adds presets to list, creates eventListener
	 * @param {Node} app 
	 * @param {Node} list 
	 * @param {Array} presets 
	 */
	list(app, list, presets) {
		list.addEventListener('change', () => this.load(app, JSON.parse(list.value)))
		Object.keys(presets).forEach(key => this.add(list, presets[key].name, presets[key].data))
		if (this.settings.storage) Object.keys(localStorage).forEach(key => {
			if (key.startsWith(this.settings.storage)) this.add(list, key, localStorage.getItem(key))
		})
	}
	/**
	 * @function save
	 * @description Saves the current state of the app
	 * @param {Node} app
	 */
	save(app) {
		return JSON.stringify(Object.fromEntries(new FormData(app)))
	}
	/**
	 * @function scope
	 * @description Returns a node based on scope
	 * @param {Node} input
	 * @param {String} scope
	 */
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
	/**
	 * @function set
	 * @description Sets a CSS Custom Property
	 * @param {Node} input
	 */
	set(input) {
		if (this.settings.classNode && input?.type === 'radio') return this.classes(input)
		const key = input.dataset.key || input.name
		const node = this.scope(input, input.dataset.scope)
		if (key && node) { 
			const value = input.value + (input.dataset.unit || '')
			node.style.setProperty(key.startsWith('--') ? key : '--' + key, value)
		}
	}
	/**
	 * @function update
	 * @description Updates the app
	 * @param {Node} app
	 */
	update(app) {
		if (this.settings.classNode) return
		Array.from(app.elements).forEach(input => input.value && input.dispatchEvent(new Event('input', { bubbles: true })))
	}
}