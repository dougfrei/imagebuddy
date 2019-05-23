import { getSizesFromAttribute, elementIsCached, shouldIgnoreElement, loadImage, compareURLs } from '../source/DOMUtil';

describe('parsing attribute sources string', () => {
	test('should be correct with multiple sources', () => {
		const attrStr = 'http://via.placeholder.com/320x180 320w 180h, http://via.placeholder.com/533x300 533w 300h, http://via.placeholder.com/854x480 854w 480h, http://via.placeholder.com/1280x720 1280w 720h, http://via.placeholder.com/1440x810 1440w 810h, http://via.placeholder.com/1920x1080 1920w 1080h';

		const parsedSizes = getSizesFromAttribute(attrStr);

		expect(parsedSizes).toBeDefined();
		expect(parsedSizes).not.toBeFalsy();

		expect(parsedSizes).toEqual([
			{ url: 'http://via.placeholder.com/320x180', width: 320, height: 180 },
			{ url: 'http://via.placeholder.com/533x300', width: 533, height: 300 },
			{ url: 'http://via.placeholder.com/854x480', width: 854, height: 480 },
			{ url: 'http://via.placeholder.com/1280x720', width: 1280, height: 720 },
			{ url: 'http://via.placeholder.com/1440x810', width: 1440, height: 810 },
			{ url: 'http://via.placeholder.com/1920x1080', width: 1920, height: 1080 }
		]);
	});

	test('should be correct with one source', () => {
		const attrStr = 'http://via.placeholder.com/320x180 320w 180h';

		const parsedSizes = getSizesFromAttribute(attrStr);

		expect(parsedSizes).toBeDefined();
		expect(parsedSizes).not.toBeFalsy();

		expect(parsedSizes).toEqual([
			{ url: 'http://via.placeholder.com/320x180', width: 320, height: 180 }
		]);
	});

	it('should return an empty array for an empty string', () => {
		const parsedSizes = getSizesFromAttribute('');

		expect(parsedSizes).toEqual([]);
	});
});

describe('element cache detection', () => {
	test('should confirm element has been cached', () => {
		const cacheId = Math.random().toString(36).substring(7);

		document.body.innerHTML = `
			<img id="test" src="" data-ib-cache-id="${cacheId}" />
		`;

		const el = document.getElementById('test');

		expect(elementIsCached(el as Element)).toBe(true);
	});

	test('should confirm element has not been cached', () => {
		document.body.innerHTML = `
			<img id="test" src="" />
		`;

		const el = document.getElementById('test');

		expect(elementIsCached(el as Element)).toBe(false);
	});

	test('should confirm element is ignored from caching', () => {
		document.body.innerHTML = `
			<img id="test" src="" data-ib-no-cache />
		`;

		const el = document.getElementById('test');

		expect(elementIsCached(el as Element)).toBe(false);
	});
});

describe('element ignore detection', () => {
	test('should confirm element is ignored', () => {
		document.body.innerHTML = `
			<img id="test" src="" data-ib-ignore />
		`;

		const el = document.getElementById('test');

		expect(shouldIgnoreElement(el as Element)).toBe(true);
	});

	test('should confirm element is not ignored', () => {
		document.body.innerHTML = `
			<img id="test" src="" />
		`;

		const el = document.getElementById('test');

		expect(shouldIgnoreElement(el as Element)).toBe(false);
	});
});

describe('loading an image', () => {
	test('should be successful', () => {
		const imageUrl = 'http://via.placeholder.com/320x180';

		expect(loadImage(imageUrl)).resolves.toBe(imageUrl);
	});

	test('should fail', () => {
		const imageUrl = 'https://127.0.0.1/error.jpg';

		expect(loadImage(imageUrl)).rejects.toBe(imageUrl);
	});
});

describe('comparing URLs', () => {
	test('should be true', () => {
		expect(compareURLs('https://www.test.com/image.jpg', '//www.test.com/image.jpg')).toBe(true);
	});

	test('should be false', () => {
		expect(compareURLs('https://www.test.com/image.jpg', '//www.test.com/image2.jpg')).toBe(false);
	});
});
