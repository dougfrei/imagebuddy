export default class {
	enabled: boolean;

	constructor(enabled = false) {
		this.enabled = enabled;
	}

	debug(...args: any[]) {
		if (this.enabled) {
			console.log(...args);
		}
	}

	debugInfo(...args: any[]) {
		if (this.enabled) {
			console.info(...args);
		}
	}

	debugTable(...args: any[]) {
		if (this.enabled) {
			console.table(...args);
		}
	}
}
