/**
 * Object.assign polyfill for IE
 */
export function polyfillObjectAssign() {
	if (typeof Object.assign !== 'function') {
		Object.assign = function(target, varArgs) { // .length of function is 2
			'use strict';

			if (target === null) { // TypeError if undefined or null
				throw new TypeError('Cannot convert undefined or null to object');
			}

			var to = Object(target);

			for (var index = 1; index < arguments.length; index++) {
				var nextSource = arguments[index];

				if (nextSource !== null) { // Skip over if undefined or null
					for (var nextKey in nextSource) {
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
		const CustomEvent = function(event, params) {
			const evtParams = params || { bubbles: false, cancelable: false, detail: undefined };
			const evt = document.createEvent('CustomEvent');

			evt.initCustomEvent(event, evtParams.bubbles, evtParams.cancelable, evtParams.detail);

			return evt;
		};

		CustomEvent.prototype = window.Event.prototype;

		window.CustomEvent = CustomEvent;
	}
}
