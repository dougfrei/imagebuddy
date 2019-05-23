import { parseBooleanString } from '../source/ImageBuddyUtil';

describe('parsing a boolean string', () => {
	test('should equal true for value "true"', () => {
		const result = parseBooleanString('true');

		expect(result).toBe(true);
	});

	test('should equal false for value "false"', () => {
		const result = parseBooleanString('false');

		expect(result).toBe(false);
	});

	test('should equal false for value "tru"', () => {
		const result = parseBooleanString('tru');

		expect(result).toBe(false);
	});

	test('should equal true for value "1"', () => {
		const result = parseBooleanString('1');

		expect(result).toBe(true);
	});

	test('should equal false for value "0"', () => {
		const result = parseBooleanString('0');

		expect(result).toBe(false);
	});
});
