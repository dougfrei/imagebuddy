import ImageToolsUtil from './ImageToolsUtil';
import ImageToolsDebug from './ImageToolsDebug';
import ImageToolsDOMElement from './ImageToolsDOMElement';
import ImageToolsEvents from './ImageToolsEvents';

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

		this.debugger = new ImageToolsDebug(this.opts.debug);

		this.resizeHandler = this.resizeHandler.bind(this);
		this.scrollHandler = this.scrollHandler.bind(this);

		this.setupEventListeners();
		this.update();
	}

	processElementQueue() {
		let numProcessed = 0;

		if (!this.elements.queue.length) {
			return numProcessed;
		}

		for (let i = 0; i < this.elements.queue.length; i++) {
			const item = this.elements.queue[i];

			if (item.options.lazyLoad && item.canLazyLoad(item) === false) {
				continue;
			}

			item.chooseImage();

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
		this.debugger.debugInfo(this.elements.queue);

		if (updateOffsetTop) {
			for (let i = 0; i < this.elements.queue.length; i++) {
				this.elements.queue[i].calculateElementTopOffset();
			}
		}

		const numProcessed = this.processElementQueue();
		const t2 = performance.now();
		
		this.debugger.debug('ImageTools: update complete', `${numProcessed} elements`, `${Math.round(t2 - t1)}ms`);
		
		// window.dispatchEvent(new CustomEvent('it-update', {}));
		ImageToolsEvents.emit('update');
	}

	/**
	 * Setup and throttle event listeners -- scroll & resize
	 */
	setupEventListeners() {
		ImageToolsUtil.throttleEventListener('resize', this.resizeHandler, { passive: true });
		ImageToolsUtil.throttleEventListener('scroll', this.scrollHandler, { passive: true });
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

			// attribute that can be used to ignore specific images when loading
			if (ImageToolsDOMElement.isCached(el) || ImageToolsDOMElement.shouldIgnore(el)) {
				continue;
			}

			elements.push(new ImageToolsDOMElement(el, this.config, this.opts));
		}

		return elements;
	}

	/**
	 * Resize handler
	 */
	resizeHandler() {
		// cycle through loaded images and see if we need to select a different source
		for (let i = 0; i < this.elements.loaded.length; i++) {
			const item = this.elements.loaded[i];
			const dimensions = item.getContainerDimensions();

			if (dimensions.width > item.currentSize.width || (!item.noHeight && dimensions.height > item.currentSize.height)) {
				this.debugger.debug('swapping image');
				item.chooseImage();
			}
		}

		// re-calculate top offsets for images in the queue
		for (let i = 0; i < this.elements.queue.length; i++) {
			this.elements.queue[i].calculateElementTopOffset();
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

	static on(event, listener) {
		ImageToolsEvents.on(event, listener);
	}
}

export default ImageTools;
