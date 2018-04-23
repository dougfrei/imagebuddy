export default class {
	constructor(enabled = false) {
		this.enabled = enabled;
	}

	debug() {
		if (this.enabled) {
			console.log(...arguments);
		}
	}

	debugInfo() {
		if (this.enabled) {
			console.info(...arguments);
		}
	}

	debugTable() {
		if (this.enabled) {
			console.table(...arguments);
		}
	}
}
