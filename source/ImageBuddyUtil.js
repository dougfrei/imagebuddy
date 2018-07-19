export default class {
	static getUniqueId(prefix = '') {
		if (!this.uidCounter) {
			this.uidCounter = 0;
		}

		return `${prefix}${++this.uidCounter}`;
	}

	static parseBooleanString(boolStr) {
		if (typeof boolStr === 'string' && boolStr.toLowerCase() === 'true') {
			return true;
		}

		return Boolean(parseInt(boolStr));
	}

	static passiveEventListenerSupported() {
		// check for passive event listener support
		let passiveSupported = false;

		try {
			const options = Object.defineProperty({}, 'passive', {
				get: function() {
					passiveSupported = true;
				}
			});

			window.addEventListener('test', null, options);
		} catch(err) {}

		return passiveSupported;
	}

	/**
	 * Setup a throttled event listener
	 *
	 * @param {string} name
	 * @param {function} callback
	 * @param {object} options
	 */
	static throttleEventListener(eventName, callback, options) {
		const passiveSupported = this.passiveEventListenerSupported();

		options.passive = (typeof options.passive === 'undefined') ? true : options.passive;
		options.capture = (typeof options.capture === 'undefined') ? false : options.capture;

		if (!this.eventsRunning) {
			this.eventsRunning = {};
		}

		if (!this.eventsRunning.hasOwnProperty(eventName)) {
			this.eventsRunning[eventName] = false;
		}

		window.addEventListener(eventName, () => {
			if (this.eventsRunning[eventName]) {
				return;
			}

			this.eventsRunning[eventName] = true;

			requestAnimationFrame(() => {
				window.dispatchEvent(new CustomEvent(`${eventName}-throttled`));
				this.eventsRunning[eventName] = false;
			});
		}, passiveSupported ? options : options.capture);

		if (typeof callback === 'function') {
			window.addEventListener(`${eventName}-throttled`, callback, passiveSupported ? options : options.capture);
		}
	}
}
