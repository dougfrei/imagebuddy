if (typeof Object.assign != 'function') {
  Object.assign = function(target, varArgs) { // .length of function is 2
    'use strict';
    if (target == null) { // TypeError if undefined or null
      throw new TypeError('Cannot convert undefined or null to object');
    }

    var to = Object(target);

    for (var index = 1; index < arguments.length; index++) {
      var nextSource = arguments[index];

      if (nextSource != null) { // Skip over if undefined or null
        for (var nextKey in nextSource) {
          // Avoid bugs when hasOwnProperty is shadowed
          if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
    return to;
  };
}

class ImageTools {
    /**
     * Constructor
     *
     * @param {object} opts
     */
    constructor(opts) {
        this.eventsRunning = {};
        this.elementCache = [];

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
				matchDPR: 'data-it-match-dpr'
            }
        };

        this.opts = Object.assign({
            debug: false,
            matchDPR: true,
            lazyLoad: false,
            lazyLoadThreshold: 100
        }, opts);

        this.setupEventListeners();
		this.update();
    }

	update() {
		this.getElements();

		// this.elementCache.forEach(item => {
        //     if (item.loaded || (item.options.lazyLoad && !this.canLazyLoad(item))) {
        //         return;
        //     }
		//
        //     this.chooseImage(item);
        // });

		for (var i = 0; i < this.elementCache.length; i++) {
			const item = this.elementCache[i];

		    if (item.loaded || (item.options.lazyLoad && !this.canLazyLoad(item))) {
                continue;
            }

            this.chooseImage(item);
		}
	}

    /**
     * Loop through the current element cache and choose images
     */
    // processElementCache() {
    //     this.elementCache.forEach(item => {
    //         if (item.loaded || (item.lazyLoad && !this.canLazyLoad(item))) {
    //             return;
    //         }
	//
    //         this.chooseImage(item);
    //     });
    // }

    /**
     * Test if an item is lazy load-able
     *
     * @param {object} item
     */
    canLazyLoad(item) {
        if (!item.options.lazyLoad || item.loaded) {
            return false;
        }

        // if (item.el.offsetTop - (window.scrollY + window.innerHeight) <= this.opts.lazyLoadThreshold) {
		if (item.el.offsetTop - (window.scrollY + window.innerHeight) <= item.options.lazyLoadThreshold) {
            return true;
        }

        return false;
    }

    /**
     * Setup a throttled event listener
     *
     * @param {string} name
     * @param {function} callback
     */
    throttleEventListener(eventName, callback) {
        if (!this.eventsRunning.hasOwnProperty(eventName)) {
            this.eventsRunning[eventName] = false;
        }

        window.addEventListener(eventName, () => {
            if (this.eventsRunning[eventName]) {
                return;
            }

            this.eventsRunning[eventName] = true;

            requestAnimationFrame(() => {
                window.dispatchEvent(new CustomEvent(eventName+'-throttled'));
                this.eventsRunning[eventName] = false;
            });
        });

        if (typeof callback == 'function') {
            window.addEventListener(eventName+'-throttled', callback);
        }
    }

    /**
     * Setup and throttle event listeners -- scroll & resize
     */
    setupEventListeners() {
        this.throttleEventListener('resize', this.resizeHandler.bind(this));
        this.throttleEventListener('scroll', this.scrollHandler.bind(this));
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

    /**
     * Get all the HTML elements configured for image selection
     */
    getElements() {
        this.elementCache = [];

		const foundEls = document.querySelectorAll(`[${this.config.attributes.sources}]`);

		for (var i =0; i < foundEls.length; i++) {
			const el = foundEls[i];

            this.elementCache.push({
                el: el,
                elType: el.tagName.toLowerCase(),
                container: this.getContainerDimensions(el),
                sizes: this.getSizes(el.getAttribute(this.config.attributes.sources)),
                // lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? el.getAttribute(this.config.attributes.lazyLoad) == 'true' : this.opts.lazyLoad,
                loaded: false, // FIXME: figure out a way to check if images are already loaded when this array is created
				options: {
					lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? el.getAttribute(this.config.attributes.lazyLoad) == 'true' : this.opts.lazyLoad,
					lazyLoadThreshold: el.getAttribute(this.config.attributes.lazyLoadThreshold) ? el.getAttribute(this.config.attributes.lazyLoadThreshold) : this.opts.lazyLoadThreshold,
					matchDPR: el.getAttribute(this.config.attributes.matchDPR) ? el.getAttribute(this.config.attributes.matchDPR) : this.opts.matchDPR,
				}
            });
		}

        // document.querySelectorAll(`[${this.config.attributes.sources}]`).forEach((el) => {
        //     this.elementCache.push({
        //         el: el,
        //         elType: el.tagName.toLowerCase(),
        //         container: this.getContainerDimensions(el),
        //         sizes: this.getSizes(el.getAttribute(this.config.attributes.sources)),
        //         // lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? el.getAttribute(this.config.attributes.lazyLoad) == 'true' : this.opts.lazyLoad,
        //         loaded: false, // FIXME: figure out a way to check if images are already loaded when this array is created
		// 		options: {
		// 			lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? el.getAttribute(this.config.attributes.lazyLoad) == 'true' : this.opts.lazyLoad,
		// 			lazyLoadThreshold: el.getAttribute(this.config.attributes.lazyLoadThreshold) ? el.getAttribute(this.config.attributes.lazyLoadThreshold) : this.opts.lazyLoadThreshold,
		// 			matchDPR: el.getAttribute(this.config.attributes.matchDPR) ? el.getAttribute(this.config.attributes.matchDPR) : this.opts.matchDPR,
		// 		}
        //     });
        // });

        this.debugInfo(this.elementCache);
    }

    /**
     * Get container dimensions of an HTML element
     *
     * @param {object} el
     */
    getContainerDimensions(el) {
        let container = {
            width: 0,
            height: 0
        };

		const displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

		if (displayStyle != 'block' && el.parentElement) {
			container = this.getContainerDimensions(el.parentElement);
		} else {
			container.width = el.clientWidth;
			container.height = el.clientHeight;
		}

		// switch (el.tagName.toLowerCase()) {
		// 	case 'section':
		// 	case 'div':
		// 		container.width = el.clientWidth;
		// 		container.height = el.clientHeight;
		// 		break;
		//
		// 	default:
		// 		if (el.parentElement) {
		// 			container = this.getContainerDimensions(el.parentElement);
		// 		}
		//
		// 		break;
		// }

        return container;
    }

    /**
     * Create an array of image sizes from the "data-it-sources" attribute
     *
     * @param {string} rImgSources
     */
    getSizes(rImgSources) {
        return rImgSources
            .split(';')
            .map(sizeEl => {
                const [url, width, height] = sizeEl.split(',');
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
		const isLandscape = containerWidth > containerHeight;

		let score = 1;

		if (imageWidth >= containerWidth) {
			score *= containerWidth / imageWidth;
		} else {
			score -= Math.abs(containerWidth-imageWidth);
		}

		if (imageHeight >= containerHeight) {
			score *= containerHeight / imageHeight;
		} else {
			score -= Math.abs(containerHeight-imageHeight);
		}



		// let containerRatio = isLandscape ? containerWidth / containerHeight : containerHeight / containerWidth;
		// let imageRatio = isLandscape ? imageWidth / imageHeight : imageHeight / imageWidth;
		//
		// let ratioTest = Math.abs(containerRatio - imageRatio);
		// let widthTest = isLandscape ? Math.abs(imageWidth - containerWidth) : Math.abs(imageHeight - containerHeight);
		// let widthTest = isLandscape ? imageWidth - containerWidth : imageHeight - containerHeight;
		// size.score = widthTest * ratioTest;

		// size.containerRatio = containerRatio;
		// size.imageRatio = imageRatio;
		// size.ratioTest = ratioTest*10;
		// size.widthTest = widthTest/10;

		// size.score = 100 - size.widthTest - size.ratioTest;

		return score;
	}

    /**
     * Choose the appropriate image and apply it to the element
     *
     * @param {object} item
     */
    chooseImage(item) {
		const sizes = this.getSizes(item.el.getAttribute(this.config.attributes.sources));
        const elType = item.el.tagName.toLowerCase();

        const container = this.getContainerDimensions(item.el);

		// if (this.opts.matchDPR) {
		if (item.options.matchDPR) {
            container.width *= window.devicePixelRatio;
            container.height *= window.devicePixelRatio;
        }

		// let possibleSizes = sizes.filter(function(size) {
		// 	return size.width >= container.width && size.height >= container.height;
        // });

		let scoredSizes = sizes.map(size => {
			size.score = this.calculateUsabilityScore(container.width, container.height, size.width, size.height);

			return size;
		});

		scoredSizes.sort((a, b) => a.score - b.score);

		this.debugTable(scoredSizes);

        let idealImage = scoredSizes[scoredSizes.length-1];

		this.debug(idealImage);

		if (elType == 'img') {
			item.el.setAttribute('src', idealImage.url);
		} else {
			item.el.style.backgroundImage = `url('${idealImage.url}')`;
		}

        item.loaded = true;
    }

    /**
     * Resize handler
     */
    resizeHandler() {
        // update container sizes
        this.debug('resizeHandler');
    }

    /**
     * Scroll handler -- check for lazy load-able images
     */
    scrollHandler() {
        // lazy load images
		for (var i = 0; i < this.elementCache.length; i++) {
			const item = this.elementCache[i];

			if (item.loaded || (item.options.lazyLoad && !this.canLazyLoad(item))) {
            	continue;
            }

            // this.debugInfo('choosing image', item);
			console.log('lazy loading', item);
            this.chooseImage(item);
		}

        // this.elementCache.forEach(item => {
        //     if (item.loaded || (item.options.lazyLoad && !this.canLazyLoad(item))) {
        //         return;
        //     }
		//
        //     // this.debugInfo('choosing image', item);
		// 	console.log('lazy loading', item);
        //     this.chooseImage(item);
        // });
    }
}
