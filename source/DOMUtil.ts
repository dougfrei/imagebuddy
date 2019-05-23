import { ImageSource, ImageSize } from './interfaces/index';

export function getPageYOffset(): number {
	if (typeof window.pageYOffset !== 'undefined') {
		return window.pageYOffset;
	}

	const scrollEl = document.scrollingElement || document.documentElement;

	return scrollEl.scrollTop;
}

export function calculateElementTopOffset(el: HTMLElement): number {
	return el.getBoundingClientRect().top + getPageYOffset();
}

/**
 * Create an array of image sizes from the "data-ib-sources" attribute
 *
 * @param {string} rImgSources
 */
export function getSizesFromAttribute(rImgSources: string): ImageSource[] {
	if (!rImgSources.trim()) {
		return [];
	}

	return rImgSources
		.split(',')
		.map((sizeEl) => {
			const [url, width, height] = sizeEl.trim().split(' ');

			return {
				url,
				width: parseInt(width, 10),
				height: parseInt(height, 10)
			};
		})
		.sort((a, b) => {
			if (a.width >= a.height) {
				return a.width > b.width ? 1 : -1;
			}

			return a.height > b.height ? 1 : -1;
		});
}

export function elementIsCached(el: Element): boolean {
	if (!el) {
		return false;
	}

	if (el.hasAttribute('data-ib-no-cache')) {
		return false;
	}

	if (el.getAttribute('data-ib-cache-id')) {
		return true;
	}

	return false;
}

export function shouldIgnoreElement(el: Element) {
	return el.hasAttribute('data-ib-ignore');
}

export function calculateUsabilityScore(containerWidth: number, containerHeight: number, imageWidth: number, imageHeight: number): number {
	// ImageBuddyUtil.debug(`container: ${containerWidth}x${containerHeight}`, `image: ${imageWidth}x${imageHeight}`);

	let score = 1;

	if (imageWidth >= containerWidth) {
		score *= containerWidth / imageWidth;
	} else {
		score -= Math.abs(containerWidth - imageWidth);
	}

	if (containerHeight) {
		if (imageHeight >= containerHeight) {
			score *= containerHeight / imageHeight;
		} else {
			score -= Math.abs(containerHeight - imageHeight);
		}
	}

	return score;
}

/**
 * Return the width of a tested element
 * This will examine a style attribute tag first and fallback to the computed style
 *
 * @param {object} el
 */
export function getElementWidth(el: HTMLElement): number {
	const displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

	if (displayStyle !== 'block' && el.parentElement) {
		return getElementWidth(el.parentElement);
	}

	return el.clientWidth;
}

/**
 * Get container dimensions of an HTML element
 *
 * @param {object} el
 * @param {bool} noHeight
 */
export function getContainerDimensions(el: HTMLElement, noHeight = false): ImageSize {
	// FIXME:
	// this is tricky since an IMG tag may not have a set height and we can't rely on
	// its container for that height value
	// I'm thinking the best way to tackle this is to see if the element has a height
	// specified -- if not we'll disregard the height value
	//      - how does a 100% height work with this?

	// el.clientHeight works fine on all tags except IMG

	const displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

	const container = {
		width: (displayStyle === 'block') ? el.clientWidth : 0,
		height: el.clientHeight ? el.clientHeight : 0 // TODO: try `parseInt(window.getComputedStyle(el).height)` here
	};

	if (!container.width && el.parentElement) {
		container.width = getElementWidth(el.parentElement);
	}

	if (noHeight) {
		container.height = 0;
	}

	return container;
}

/**
 * Creates a dummy image element and loads the requested image URL
 * Returns a promise with the loaded image URL
 *
 * @param imageURL the image URL to load
 */
export function loadImage(imageURL: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const imageLoader = new Image();

		imageLoader.onload = () => {
			resolve(imageLoader.src);
		};

		imageLoader.onerror = () => {
			reject(imageLoader.src);
		}

		imageLoader.src = imageURL;
	});
}

export function compareURLs(url1: string, url2: string): boolean {
	const testUrls = [url1, url2].map(url => {
		const anchor = document.createElement('a');

		anchor.href = url.toLowerCase();

		return anchor.host + anchor.pathname;
	});

	return testUrls[0] === testUrls[1];
}
