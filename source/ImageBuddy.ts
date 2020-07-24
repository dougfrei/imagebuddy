import ImageBuddyDebug from './ImageBuddyDebug';
import ImageBuddyDOMElement from './ImageBuddyDOMElement';
import ImageBuddyEvents from './ImageBuddyEvents';
import { elementIsCached, shouldIgnoreElement, getContainerDimensions } from './DOMUtil';
import {
	ImageBuddyOpts,
	ImageBuddyElements,
	ImageBuddyUpdateOptions,
	ImageBuddyConfig,
	IThrottleEventListenerOptions,
} from './interfaces/index';

class ImageBuddy {
	eventsRunning: any;
	elements: ImageBuddyElements;
	config: ImageBuddyConfig;
	opts: ImageBuddyOpts;
	debugger: ImageBuddyDebug;

	/**
	 * Constructor
	 *
	 * @param {object} opts
	 */
	constructor(opts: Partial<ImageBuddyOpts>) {
		this.eventsRunning = {};
		this.elements = {
			queue: [],
			loaded: [],
		};

		this.config = {
			events: {
				resize: 'ImageBuddyResize',
				scroll: 'ImageBuddyScroll',
			},
			attributes: {
				// enabled: 'data-ib-enabled',
				sources: 'data-ib-sources',
				lazyLoad: 'data-ib-lazyload',
				lazyLoadThreshold: 'data-ib-lazyload-threshold',
				matchDPR: 'data-ib-match-dpr',
				noHeight: 'data-ib-no-height',
				ignoreHiddenCheck: 'data-ib-ignore-hidden-check',
			},
			classes: {
				base: 'ib__image',
				loading: 'ib__image--loading',
				loaded: 'ib__image--loaded',
			},
		};

		// create default options and merge any overrides
		this.opts = {
			debug: false,
			matchDPR: true,
			lazyLoad: true,
			lazyLoadThreshold: 100,
			...opts,
		};

		this.debugger = new ImageBuddyDebug(this.opts.debug);

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

			if (item.options.lazyLoad && item.canLazyLoad() === false) {
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

	update(opts: ImageBuddyUpdateOptions = {}) {
		const t1 = performance.now();

		const parentEl = opts.parentEl || document.documentElement;
		const newElements = this.getElements(parentEl);
		const updateOffsetTop = opts.updateOffsetTop || false;

		this.elements.queue = this.elements.queue.concat(newElements);
		this.debugger.debugInfo(this.elements.queue);

		if (updateOffsetTop) {
			for (let i = 0; i < this.elements.queue.length; i++) {
				this.elements.queue[i].updateTopOffset();
			}
		}

		const numProcessed = this.processElementQueue();
		const t2 = performance.now();

		this.debugger.debug('ImageBuddy: update complete', `${numProcessed} elements`, `${Math.round(t2 - t1)}ms`);

		ImageBuddyEvents.emit('update');
	}

	/**
	 * Setup and throttle event listeners -- scroll & resize
	 */
	setupEventListeners() {
		this.throttleEventListener('resize', this.resizeHandler, {
			passive: true,
		});
		this.throttleEventListener('scroll', this.scrollHandler, {
			passive: true,
		});
	}

	/**
	 * Get all the HTML elements configured for image selection
	 */
	getElements(parentEl: HTMLElement) {
		const elements = [];
		const foundEls = parentEl.querySelectorAll(`[${this.config.attributes.sources}]`);

		for (let i = 0; i < foundEls.length; i++) {
			const el = foundEls[i];
			// const offsetTop = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);

			// attribute that can be used to ignore specific images when loading
			if (elementIsCached(el) || shouldIgnoreElement(el)) {
				continue;
			}

			elements.push(new ImageBuddyDOMElement(el as HTMLElement, this.config, this.opts));
		}

		return elements;
	}

	/**
	 * Resize handler
	 */
	resizeHandler = () => {
		// cycle through loaded images and see if we need to select a different source
		for (let i = 0; i < this.elements.loaded.length; i++) {
			const item = this.elements.loaded[i];
			const dimensions = getContainerDimensions(item.el, item.options.noHeight);

			if (
				dimensions.width > item.currentSize.width ||
				(!item.options.noHeight && dimensions.height > item.currentSize.height)
			) {
				this.debugger.debug('swapping image');
				item.chooseImage();
			}
		}

		// re-calculate top offsets for images in the queue
		for (let i = 0; i < this.elements.queue.length; i++) {
			this.elements.queue[i].updateTopOffset();
		}

		// load any unprocessed cache elements
		this.processElementQueue();
	};

	/**
	 * Scroll handler -- check for lazy load-able images
	 */
	scrollHandler = () => {
		// lazy load images
		this.processElementQueue();
	};

	/**
	 * Setup a throttled event listener
	 *
	 * @param {string} name
	 * @param {function} callback
	 * @param {object} options
	 */
	throttleEventListener(
		eventName: string,
		callback: EventListenerOrEventListenerObject,
		userOptions: IThrottleEventListenerOptions
	) {
		const passiveSupported = this.passiveEventListenerSupported();

		const options = Object.assign(userOptions, {
			passive: typeof userOptions.passive === 'undefined' ? true : userOptions.passive,
			capture: typeof userOptions.capture === 'undefined' ? false : userOptions.capture,
		});

		if (!this.eventsRunning) {
			this.eventsRunning = {};
		}

		const eventIsRunning = Object.prototype.hasOwnProperty.call(this.eventsRunning, eventName);

		if (!eventIsRunning) {
			this.eventsRunning[eventName] = false;
		}

		window.addEventListener(
			eventName,
			() => {
				if (this.eventsRunning[eventName]) {
					return;
				}

				this.eventsRunning[eventName] = true;

				requestAnimationFrame(() => {
					window.dispatchEvent(new CustomEvent(`${eventName}-throttled`));
					this.eventsRunning[eventName] = false;
				});
			},
			passiveSupported ? options : options.capture
		);

		if (typeof callback === 'function') {
			window.addEventListener(`${eventName}-throttled`, callback, passiveSupported ? options : options.capture);
		}
	}

	passiveEventListenerSupported() {
		// check for passive event listener support
		let passiveSupported = false;

		try {
			const options = Object.defineProperty({}, 'passive', {
				get() {
					passiveSupported = true;
					return true;
				},
			});

			window.addEventListener('test', () => {}, options);
		} catch (err) {}

		return passiveSupported;
	}

	static on(event: string, listener: CallableFunction) {
		ImageBuddyEvents.on(event, listener);
	}
}

export default ImageBuddy;
