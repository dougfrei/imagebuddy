const events: any = {};

export default class {
	static on(event: string, listener: CallableFunction) {
		if (typeof events[event] !== 'object') {
			events[event] = [];
		}

		events[event].push(listener);
	}

	static emit(event: string, ...args: any[]) {
		const eventArgs = args;

		// allow handlers to register themselves before executing
		setTimeout(() => {
			if (typeof events[event] === 'object') {
				const listeners = events[event].slice();

				for (let i = 0; i < listeners.length; i++) {
					listeners[i].apply(null, eventArgs);
				}
			}
		}, 0);
	}
}
