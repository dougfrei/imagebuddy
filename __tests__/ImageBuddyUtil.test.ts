import { stringToBoolean } from '../source/ImageBuddyUtil';

describe('convert a string to a boolean value', () => {
	test('should equal true for value "true"', () => {
		const result = stringToBoolean('true');

		expect(result).toBe(true);
	});

	test('should equal false for value "false"', () => {
		const result = stringToBoolean('false');

		expect(result).toBe(false);
	});

	test('should equal false for value "tru"', () => {
		const result = stringToBoolean('tru');

		expect(result).toBe(false);
	});

	test('should equal true for value "1"', () => {
		const result = stringToBoolean('1');

		expect(result).toBe(true);
	});

	test('should equal false for value "0"', () => {
		const result = stringToBoolean('0');

		expect(result).toBe(false);
	});
});
