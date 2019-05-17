/**
 * Object.assign polyfill for IE
 */
export function polyfillObjectAssign() {
	if (typeof Object.assign !== 'function') {
		Object.assign = function createObjectAssignPolyfill(target, varArgs) { // .length of function is 2
			if (target === null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			const to = Object(target);

			for (let index = 1; index < arguments.length; index++) {
				const nextSource = arguments[index];

				if (nextSource !== null) { // Skip over if undefined or null
					for (let nextKey in nextSource) {
						// Avoid bugs when hasOwnProperty is shadowed
						if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
							to[nextKey] = nextSource[nextKey];
						}
					}
				}
			}

			return to;
		};
	}
}

/**
 * Event constructor polyfill for IE
 */
export function polyfillCustomEvent() {
	if (typeof window.CustomEvent !== 'function') {
		const CustomEvent = function createCustomEventPolyfill(event, params) {
			const evtParams = params || { bubbles: false, cancelable: false, detail: undefined };
			const evt = document.createEvent('CustomEvent');

			evt.initCustomEvent(event, evtParams.bubbles, evtParams.cancelable, evtParams.detail);

			return evt;
		};

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	}
}
