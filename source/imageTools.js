import { polyfillObjectAssign, polyfillCustomEvent } from './polyfills';

polyfillObjectAssign();
polyfillCustomEvent();

/**
 * ImageTools class
 */
class ImageTools {
	/**
	 * Constructor
	 *
	 * @param {object} opts
	 */
	constructor(opts) {
		this.eventsRunning = {};
		this.elementCache = [];
		this.elements = {
			queue: [],
			loaded: []
		};
		this.events = [];
		this.currentCacheId = 0;

		this.config = {
			events: {
				resize: 'imageToolsResize',
				scroll: 'imageToolsScroll'
			},
			attributes: {
				// enabled: 'data-it-enabled',
				sources: 'data-it-sources',
				lazyLoad: 'data-it-lazyload',
				lazyLoadThreshold: 'data-it-lazyload-threshold',
				matchDPR: 'data-it-match-dpr',
				noHeight: 'data-it-no-height'
			},
			classes: {
				base: 'it__image',
				loading: 'it__image--loading',
				loaded: 'it__image--loaded'
			}
		};

		// create default options and merge any overrides
		this.opts = Object.assign({
			debug: false,
			matchDPR: true,
			lazyLoad: true,
			lazyLoadThreshold: 100
		}, opts);

		// check for passive event listener support
		this.passiveSupported = false;

		try {
			const options = Object.defineProperty({}, 'passive', {
				get: function() {
					this.passiveSupported = true;
				}
			});

			window.addEventListener('test', null, options);
		} catch(err) {}

		this.setupEventListeners();
		this.update();
	}

	get nextCacheId() {
		this.currentCacheId = this.currentCacheId + 1;

		return this.currentCacheId;
	}

	processElementQueue() {
		let numProcessed = 0;

		if (!this.elements.queue.length) {
			return numProcessed;
		}

		for (let i = 0; i < this.elements.queue.length; i++) {
			const item = this.elements.queue[i];

			if (item.options.lazyLoad && this.canLazyLoad(item) === false) {
				continue;
			}

			this.chooseImage(item);

			// move to loaded array
			this.elements.queue.splice(i, 1);
			this.elements.loaded.push(item);
			
			i--;

			numProcessed++;
		}

		return numProcessed;
	}

	update(opts = {}) {
		const t1 = performance.now();

		const parentEl = opts.parentEl || document;
		const newElements = this.getElements(parentEl);
		const updateOffsetTop = opts.updateOffsetTop || false;

		this.elements.queue = this.elements.queue.concat(newElements);
		this.debugInfo(this.elements.queue);

		if (updateOffsetTop) {
			for (let i = 0; i < this.elements.queue.length; i++) {
				this.elements.queue[i].offsetTop = this.calculateElementTopOffset(this.elements.queue[i].el);
			}
		}

		const numProcessed = this.processElementQueue();
		const t2 = performance.now();
		
		this.debug('ImageTools: update complete', `${numProcessed} elements`, `${Math.round(t2 - t1)}ms`);
		
		window.dispatchEvent(new CustomEvent('it-update', {}));
	}

	/**
	 * Test if an item is lazy load-able
	 *
	 * @param {object} item
	 */
	canLazyLoad(item) {
		if (!item.options.lazyLoad || item.loaded) {
			return false;
		}

		if (item.offsetTop - (window.pageYOffset + window.innerHeight) <= item.options.lazyLoadThreshold) {
			return true;
		}

		return false;
	}

	/**
	 * Setup a throttled event listener
	 *
	 * @param {string} name
	 * @param {function} callback
	 * @param {object} options
	 */
	throttleEventListener(eventName, callback, options) {
		options.passive = (typeof options.passive === 'undefined') ? true : options.passive;
		options.capture = (typeof options.capture === 'undefined') ? false : options.capture;

		if (!this.eventsRunning.hasOwnProperty(eventName)) {
			this.eventsRunning[eventName] = false;
		}

		window.addEventListener(eventName, () => {
			if (this.eventsRunning[eventName]) {
				return;
			}

			this.eventsRunning[eventName] = true;

			requestAnimationFrame(() => {
				window.dispatchEvent(new CustomEvent(`${eventName}-throttled`));
				this.eventsRunning[eventName] = false;
			});
		}, this.passiveSupported ? options : options.capture);

		if (typeof callback === 'function') {
			window.addEventListener(`${eventName}-throttled`, callback, this.passiveSupported ? options : options.capture);
		}
	}

	/**
	 * Setup and throttle event listeners -- scroll & resize
	 */
	setupEventListeners() {
		this.throttleEventListener('resize', this.resizeHandler.bind(this), { passive: true });
		this.throttleEventListener('scroll', this.scrollHandler.bind(this), { passive: true });
	}

	/**
	 * Print a debug message
	 */
	debug() {
		if (this.opts.debug) {
			console.log(...arguments);
		}
	}

	debugInfo() {
		if (this.opts.debug) {
			console.info(...arguments);
		}
	}

	debugTable() {
		if (this.opts.debug) {
			console.table(...arguments);
		}
	}

	calculateElementTopOffset(el) {
		return el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
	}

	/**
	 * Get all the HTML elements configured for image selection
	 */
	getElements(parentEl) {
		const elements = [];
		const foundEls = parentEl.querySelectorAll(`[${this.config.attributes.sources}]`);

		for (let i = 0; i < foundEls.length; i++) {
			const el = foundEls[i];
			// const offsetTop = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);

			if (el.getAttribute('data-it-cache-id') && !el.hasAttribute('data-it-no-cache')) {
				continue;
			}

			// attribute that can be used to ignore specific images when loading
			// useful for lazy-loading images within sliders
			if (el.hasAttribute('data-it-ignore')) {
				continue;
			}

			el.setAttribute('data-it-cache-id', this.nextCacheId);
			el.classList.add(this.config.classes.base);

			elements.push({
				el: el,
				elType: el.tagName.toLowerCase(),
				cacheId: el.getAttribute('data-it-cache-id'),
				offsetTop: this.calculateElementTopOffset(el),
				sizes: this.getSizes(el.getAttribute(this.config.attributes.sources)),
				currentSize: false,
				loaded: false, // FIXME: figure out a way to check if images are already loaded when this array is created
				options: {
					lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? this.parseBooleanString(el.getAttribute(this.config.attributes.lazyLoad)) : this.opts.lazyLoad,
					lazyLoadThreshold: el.getAttribute(this.config.attributes.lazyLoadThreshold) ? el.getAttribute(this.config.attributes.lazyLoadThreshold) : this.opts.lazyLoadThreshold,
					matchDPR: el.getAttribute(this.config.attributes.matchDPR) ? this.parseBooleanString(el.getAttribute(this.config.attributes.matchDPR)) : this.opts.matchDPR,
					noHeight: el.getAttribute(this.config.attributes.noHeight) ? el.getAttribute(this.config.attributes.noHeight) : false
				}
			});
		}

		return elements;
	}

	parseBooleanString(boolStr) {
		if (typeof boolStr === 'string' && boolStr.toLowerCase() === 'true') {
			return true;
		}

		return Boolean(parseInt(boolStr));
	}

	/**
	 * Get container dimensions of an HTML element
	 *
	 * @param {object} el
	 * @param {bool} noHeight
	 */
	getContainerDimensions(el, noHeight) {
		// FIXME:
		// this is tricky since an IMG tag may not have a set height and we can't rely on
		// its container for that height value
		// I'm thinking the best way to tackle this is to see if the element has a height
		// specified -- if not we'll disregard the height value
		//      - how does a 100% height work with this?

		// el.clientHeight works fine on all tags except IMG

		const displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

		const container = {
			width: (displayStyle == 'block') ? el.clientWidth : 0,
			height: el.clientHeight ? el.clientHeight : 0 // TODO: try `parseInt(window.getComputedStyle(el).height)` here
		};

		if (!container.width) {
			container.width = this.getElementWidth(el.parentElement);
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

	/**
	 * Create an array of image sizes from the "data-it-sources" attribute
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

	calculateUsabilityScore(containerWidth, containerHeight, imageWidth, imageHeight) {
		this.debug(`container: ${containerWidth}x${containerHeight}`, `image: ${imageWidth}x${imageHeight}`);

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
	 * Choose the appropriate image and apply it to the element
	 *
	 * @param {object} item
	 */
	chooseImage(item) {
		if (item.isLoading) {
			return;
		}

		item.isLoading = true;

		const sizes = this.getSizes(item.el.getAttribute(this.config.attributes.sources));
		const elType = item.el.tagName.toLowerCase();

		if (elType == 'img' && parseInt(getComputedStyle(item.el).width) <= 1) {
			item.el.style.width = '100%';
		}

		const container = this.getContainerDimensions(item.el, item.options.noHeight);

		if (item.options.matchDPR) {
			container.width *= window.devicePixelRatio;
			container.height *= window.devicePixelRatio;
		}

		const scoredSizes = sizes.map((size) => {
			size.score = this.calculateUsabilityScore(container.width, container.height, size.width, size.height);

			return size;
		});

		scoredSizes.sort((a, b) => a.score - b.score);

		this.debugTable(scoredSizes);

		const idealImage = scoredSizes[scoredSizes.length-1];

		this.debug(idealImage);

		this.loadImage(item.el, idealImage.url, () => {
			item.loaded = true;
			item.isLoading = false;
			item.currentSize = { width: idealImage.width, height: idealImage.height };
			item.el.classList.remove(this.config.classes.loading);
			item.el.classList.add(this.config.classes.loaded);

			this.debug(`dispatching load event: ${item.el.getAttribute('src')}`);

			window.dispatchEvent(new CustomEvent('it-imageLoad', {
				detail: {
					el: item.el
				}
			}));
		});
	}

	loadImage(el, imgSrc, callback) {
		const imageLoader = new Image();

		imageLoader.onload = function(e) {
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

	/**
	 * Resize handler
	 */
	resizeHandler() {
		// cycle through loaded images and see if we need to select a different source
		for (let i = 0; i < this.elements.loaded.length; i++) {
			const item = this.elements.loaded[i];

			const dimensions = this.getContainerDimensions(item.el);
			
			if (dimensions.width > item.currentSize.width || (!item.noHeight && dimensions.height > item.currentSize.height)) {
				this.debug('swapping image');
				this.chooseImage(item);
			}
		}

		// load any unprocessed cache elements
		this.processElementQueue();
	}

	/**
	 * Scroll handler -- check for lazy load-able images
	 */
	scrollHandler() {
		// lazy load images
		this.processElementQueue();
	}

	on(event, listener) {
		if (typeof this.events[event] !== 'object') {
			this.events[event] = [];
		}

		this.events[event].push(listener);
	}

	emit(event) {
		var i, listeners, length, args = [].slice.call(arguments, 1);

		if (typeof this.events[event] === 'object') {
			listeners = this.events[event].slice();
			length = listeners.length;

			for (i = 0; i < length; i++) {
				listeners[i].apply(this, args);
			}
		}
	}
}

export default ImageTools;
