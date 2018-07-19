import ImageBuddyUtil from './ImageBuddyUtil';
import ImageBuddyEvents from './ImageBuddyEvents';

export default class {
	constructor(el, itConfig, itOpts) {
		el.classList.add(itConfig.classes.base);
		el.setAttribute('data-ib-cache-id', ImageBuddyUtil.getUniqueId());

		this.el = el;
		this.config = itConfig;
		
		this.elType = el.tagName.toLowerCase();
		this.cacheId = el.getAttribute('data-ib-cache-id');
		// this.offsetTop = this.calculateElementTopOffset(el);
		this.sizes = this.getSizes(el.getAttribute(itConfig.attributes.sources));
		this.currentSize = false;
		this.loaded = false; // FIXME: figure out a way to check if images are already loaded when this array is created
		this.isLoading = false;
		this.options = {
			lazyLoad: el.getAttribute(itConfig.attributes.lazyLoad) ? ImageBuddyUtil.parseBooleanString(el.getAttribute(itConfig.attributes.lazyLoad)) : itOpts.lazyLoad,
			lazyLoadThreshold: el.getAttribute(itConfig.attributes.lazyLoadThreshold) ? el.getAttribute(itConfig.attributes.lazyLoadThreshold) : itOpts.lazyLoadThreshold,
			matchDPR: el.getAttribute(itConfig.attributes.matchDPR) ? ImageBuddyUtil.parseBooleanString(el.getAttribute(itConfig.attributes.matchDPR)) : itOpts.matchDPR,
			noHeight: el.getAttribute(itConfig.attributes.noHeight) ? el.getAttribute(itConfig.attributes.noHeight) : false
		}

		this.calculateElementTopOffset();
	}

	calculateElementTopOffset() {
		this.offsetTop = this.el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
	}

	/**
	 * Create an array of image sizes from the "data-ib-sources" attribute
	 *
	 * @param {string} rImgSources
	 */
	getSizes(rImgSources) {
		return rImgSources
			.split(',')
			.map(sizeEl => {
				const [url, width, height] = sizeEl.trim().split(' ');

				return { url: url, width: parseInt(width), height: parseInt(height) };
			})
			.sort((a, b) => {
				if (a.width >= a.height) {
					return a.width > b.width ? 1 : -1;
				} else {
					return a.height > b.height ? 1 : -1;
				}
			});
	}

	/**
	 * Test if an item is lazy load-able
	 *
	 * @param {object} item
	 */
	canLazyLoad() {
		if (!this.options.lazyLoad || this.loaded) {
			return false;
		}

		if (this.offsetTop - (window.pageYOffset + window.innerHeight) <= this.options.lazyLoadThreshold) {
			return true;
		}

		return false;
	}

	static isCached(el) {
		return (el.getAttribute('data-ib-cache-id') && !el.hasAttribute('data-ib-no-cache'));
	}

	static shouldIgnore(el) {
		return el.hasAttribute('data-ib-ignore');
	}

	/**
	 * Choose the appropriate image and apply it to the element
	 *
	 * @param {object} item
	 */
	chooseImage() {
		if (this.isLoading) {
			return;
		}

		this.isLoading = true;

		const sizes = this.getSizes(this.el.getAttribute(this.config.attributes.sources));
		const elType = this.el.tagName.toLowerCase();

		if (elType == 'img' && parseInt(getComputedStyle(this.el).width) <= 1) {
			this.el.style.width = '100%';
		}

		const container = this.getContainerDimensions(this.el, this.options.noHeight);

		if (this.options.matchDPR) {
			container.width *= window.devicePixelRatio;
			container.height *= window.devicePixelRatio;
		}

		const scoredSizes = sizes.map((size) => {
			size.score = this.calculateUsabilityScore(container.width, container.height, size.width, size.height);

			return size;
		});

		scoredSizes.sort((a, b) => a.score - b.score);

		// ImageBuddyUtil.debugTable(scoredSizes);

		const idealImage = scoredSizes[scoredSizes.length-1];

		// ImageBuddyUtil.debug(idealImage);

		this.loadImage(idealImage.url, () => {
			this.loaded = true;
			this.isLoading = false;
			this.currentSize = { width: idealImage.width, height: idealImage.height };
			this.el.classList.remove(this.config.classes.loading);
			this.el.classList.add(this.config.classes.loaded);

			ImageBuddyEvents.emit('image-loaded', this.el);
		});
	}

	calculateUsabilityScore(containerWidth, containerHeight, imageWidth, imageHeight) {
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
	 * Get container dimensions of an HTML element
	 *
	 * @param {object} el
	 * @param {bool} noHeight
	 */
	getContainerDimensions(noHeight = false) {
		// FIXME:
		// this is tricky since an IMG tag may not have a set height and we can't rely on
		// its container for that height value
		// I'm thinking the best way to tackle this is to see if the element has a height
		// specified -- if not we'll disregard the height value
		//      - how does a 100% height work with this?

		// el.clientHeight works fine on all tags except IMG

		const displayStyle = this.el.style.display ? this.el.style.display : window.getComputedStyle(this.el).display;

		const container = {
			width: (displayStyle == 'block') ? this.el.clientWidth : 0,
			height: this.el.clientHeight ? this.el.clientHeight : 0 // TODO: try `parseInt(window.getComputedStyle(el).height)` here
		};

		if (!container.width) {
			container.width = this.getElementWidth(this.el.parentElement);
		}

		if (noHeight) {
			container.height = 0;
		}

		return container;
	}

	/**
	 * Return the width of a tested element
	 * This will examine a style attribute tag first and fallback to the computed style
	 *
	 * @param {object} el
	 */
	getElementWidth(el) {
		const displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

		if (displayStyle != 'block' && el.parentElement) {
			return this.getElementWidth(el.parentElement);
		}

		return el.clientWidth;
	}

	loadImage(imgSrc, callback) {
		const imageLoader = new Image();
		const el = this.el;

		imageLoader.onload = function() {
			if (el.tagName.toLowerCase() === 'img') {
				el.setAttribute('src', this.src);
			} else {
				el.style.backgroundImage = `url('${this.src}')`;
			}

			if (callback && typeof callback == 'function') {
				callback();
			}
		};

		imageLoader.src = imgSrc;
	}
}
