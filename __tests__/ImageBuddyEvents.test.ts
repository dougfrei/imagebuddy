import ImageBuddyEvents from "../source/ImageBuddyEvents";

describe('events should', () => {
	test('publish and call one subscriber with one parameter successfully', () => {
		const promiseWrapper = () => new Promise((resolve) => {
			ImageBuddyEvents.on('test-event', (testStr: string) => {
				resolve(testStr);
			});

			ImageBuddyEvents.emit('test-event', 'testing');
		});

		return expect(promiseWrapper()).resolves.toBe('testing');
	});

	test('publish and call one subscriber with two parameters successfully', () => {
		const promiseWrapper = () => new Promise((resolve) => {
			ImageBuddyEvents.on('test-event', (testStr: string, testNum: number) => {
				resolve([testStr, testNum]);
			});

			ImageBuddyEvents.emit('test-event', 'testing', 123);
		});

		return expect(promiseWrapper()).resolves.toEqual(['testing', 123]);
	});
});
