export default class {
	static on(event, listener) {
		if (typeof window.itEvents === 'undefined') {
			window.itEvents = {};
		}

		if (typeof window.itEvents[event] !== 'object') {
			window.itEvents[event] = [];
		}

		window.itEvents[event].push(listener);
	}

	static emit(event) {
		if (typeof window.itEvents === 'undefined') {
			window.itEvents = {};
		}

		// allow handlers to register themselves before executing
		setTimeout(() => {
			if (typeof window.itEvents[event] === 'object') {
				const listeners = window.itEvents[event].slice();
				const { length } = listeners;
				const args = [].slice.call(arguments, 1);

				for (let i = 0; i < length; i++) {
					listeners[i].apply(this, args);
				}
			}
		}, 0);
	}
}
