import ImageBuddyEvents from './ImageBuddyEvents';
import { stringToBoolean } from './ImageBuddyUtil';
import {
	calculateElementTopOffset,
	getSizesFromAttribute,
	calculateUsabilityScore,
	getElementWidth,
	getContainerDimensions,
	loadImage,
	getPageYOffset,
	compareURLs,
} from './DOMUtil';
import {
	ImageSource,
	ImageSize,
	ImageBuddyDOMElementOptions,
	ImageBuddyConfig,
	ImageBuddyOpts,
} from './interfaces/index';

export default class {
	el: HTMLElement;
	config: ImageBuddyConfig;
	elType: string;
	sizes: ImageSource[];
	currentSize: ImageSize;
	loaded: boolean;
	isLoading: boolean;
	options: ImageBuddyDOMElementOptions;
	offsetTop: number;

	constructor(
		el: HTMLElement,
		ibConfig: ImageBuddyConfig,
		ibOpts: ImageBuddyOpts
	) {
		el.classList.add(ibConfig.classes.base);
		el.setAttribute(
			'data-ib-cache-id',
			Math.random().toString(36).substring(7)
		);

		this.el = el;
		this.config = ibConfig;

		this.elType = el.tagName.toLowerCase();
		this.sizes = getSizesFromAttribute(
			el.getAttribute(ibConfig.attributes.sources) || ''
		);
		this.currentSize = { width: 0, height: 0 };
		this.loaded = false; // FIXME: figure out a way to check if images are already loaded when this array is created
		this.isLoading = false;
		this.options = {
			lazyLoad: el.hasAttribute(ibConfig.attributes.lazyLoad)
				? stringToBoolean(
						el.getAttribute(ibConfig.attributes.lazyLoad) || ''
				  )
				: ibOpts.lazyLoad,
			lazyLoadThreshold: el.hasAttribute(
				ibConfig.attributes.lazyLoadThreshold
			)
				? parseInt(
						el.getAttribute(
							ibConfig.attributes.lazyLoadThreshold
						) || '0',
						10
				  )
				: ibOpts.lazyLoadThreshold,
			matchDPR: el.hasAttribute(ibConfig.attributes.matchDPR)
				? stringToBoolean(
						el.getAttribute(ibConfig.attributes.matchDPR) || ''
				  )
				: ibOpts.matchDPR,
			noHeight: el.hasAttribute(ibConfig.attributes.noHeight)
				? stringToBoolean(
						el.getAttribute(ibConfig.attributes.noHeight) || ''
				  )
				: false,
			ignoreHiddenCheck: el.hasAttribute(
				ibConfig.attributes.ignoreHiddenCheck
			)
				? stringToBoolean(
						el.getAttribute(
							ibConfig.attributes.ignoreHiddenCheck
						) || ''
				  )
				: false,
		};
		this.offsetTop = calculateElementTopOffset(this.el);
	}

	updateTopOffset() {
		this.offsetTop = calculateElementTopOffset(this.el);
	}

	/**
	 * Test if an item is lazy load-able
	 *
	 * @param {object} item
	 */
	canLazyLoad(): boolean {
		if (!this.options.lazyLoad || this.loaded) {
			return false;
		}

		if (
			this.offsetTop - (getPageYOffset() + window.innerHeight) <=
			this.options.lazyLoadThreshold
		) {
			return true;
		}

		return false;
	}

	/**
	 * Choose the appropriate image and apply it to the element
	 *
	 * @param {object} item
	 */
	async chooseImage() {
		if (this.isLoading) {
			return;
		}

		if (!this.options.ignoreHiddenCheck && this.isHidden()) {
			return;
		}

		this.isLoading = true;

		const sizes = getSizesFromAttribute(
			this.el.getAttribute(this.config.attributes.sources) || ''
		);
		const elType = this.el.tagName.toLowerCase();

		if (
			elType === 'img' &&
			parseInt(getComputedStyle(this.el).width || '0', 10) <= 1
		) {
			this.el.style.width = '100%';
		}

		const container = getContainerDimensions(
			this.el,
			this.options.noHeight
		);

		if (this.options.matchDPR) {
			container.width *= window.devicePixelRatio;
			container.height *= window.devicePixelRatio;
		}

		const scoredSizes = sizes.map((size) =>
			Object.assign(size, {
				score: calculateUsabilityScore(
					container.width,
					container.height,
					size.width,
					size.height
				),
			})
		);

		scoredSizes.sort((a, b) => a.score - b.score);

		// ImageBuddyUtil.debugTable(scoredSizes);

		const idealImage = scoredSizes[scoredSizes.length - 1];

		// ImageBuddyUtil.debug(idealImage);

		if (compareURLs(this.el.getAttribute('src') || '', idealImage.url)) {
			return;
		}

		try {
			const loadedImageURL = await loadImage(idealImage.url);

			if (this.el.tagName.toLowerCase() === 'img') {
				this.el.setAttribute('src', loadedImageURL);
			} else {
				this.el.style.backgroundImage = `url('${loadedImageURL}')`;
			}

			this.loaded = true;
			this.isLoading = false;
			this.currentSize = {
				width: idealImage.width,
				height: idealImage.height,
			};
			this.el.classList.remove(this.config.classes.loading);
			this.el.classList.add(this.config.classes.loaded);

			ImageBuddyEvents.emit('image-loaded', this.el);
		} catch {
			console.error('error loading image', idealImage.url);
		}
	}

	/**
	 * Check if an element is visible
	 */
	isHidden(): boolean {
		return this.el.offsetParent === null;
	}
}
