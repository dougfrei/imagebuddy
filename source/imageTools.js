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
                lazyLoad: 'data-it-lazyload'
            }
        };

        this.opts = Object.assign({
            debug: false,
            matchDPR: true,
            lazyLoadDefault: false,
            lazyLoadThreshold: 100
        }, opts);

        this.setupEventListeners();
        this.getElements();

        this.processElementCache();
    }

    /**
     * Loop through the current element cache and choose images
     */
    processElementCache() {
        this.elementCache.forEach(item => {
            if (item.loaded || (item.lazyLoad && !this.canLazyLoad(item))) {
                return;
            }

            this.chooseImage(item);
        });
    }

    /**
     * Test if an item is lazy load-able
     *
     * @param {object} item
     */
    canLazyLoad(item) {
        if (!item.lazyLoad || item.loaded) {
            return false;
        }

        if (item.el.offsetTop - (window.scrollY + window.innerHeight) <= this.opts.lazyLoadThreshold) {
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

        document.querySelectorAll(`[${this.config.attributes.sources}]`).forEach((el) => {
            this.elementCache.push({
                el: el,
                elType: el.tagName.toLowerCase(),
                container: this.getContainerDimensions(el),
                sizes: this.getSizes(el.getAttribute(this.config.attributes.sources)),
                lazyLoad: el.getAttribute(this.config.attributes.lazyLoad) ? el.getAttribute(this.config.attributes.lazyLoad) == 'true' : this.opts.lazyLoadDefault,
                loaded: false // FIXME: figure out a way to check if images are already loaded when this array is created
            });
        });

        this.debugInfo(this.elementCache);
    }

    /**
     * Get container dimensions of an HTML element
     *
     * @param {object} el
     */
    getContainerDimensions(el) {
        const container = {
            width: 0,
            height: 0
        };

        switch (el.tagName.toLowerCase()) {
            case 'div':
            case 'img':
                container.width = el.clientWidth;
                container.height = el.clientHeight;
                break;

            default:
                break;
        }

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

    /**
     * Choose the appropriate image and apply it to the element
     *
     * @param {object} item
     */
    chooseImage(item) {
        const sizes = this.getSizes(item.el.getAttribute(this.config.attributes.sources));
        const elType = item.el.tagName.toLowerCase();

		this.debugTable(sizes);

        const container = this.getContainerDimensions(item.el);

        if (this.opts.matchDPR) {
            container.width *= window.devicePixelRatio;
            container.height *= window.devicePixelRatio;
        }

        let possibleSizes = sizes.filter(function(size) {
            return size.width >= container.width && size.height >= container.height;
        });

        let idealImage = possibleSizes.length ? possibleSizes[0] : sizes[sizes.length-1];

        switch (elType) {
            case 'div':
                item.el.style.backgroundImage = `url('${idealImage.url}')`;
                break;

            case 'img':
                item.el.setAttribute('src', idealImage.url);
                break;

            default:
                break;
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
        this.elementCache.forEach(item => {
            if (item.loaded || (item.lazyLoad && !this.canLazyLoad(item))) {
                return;
            }

            // this.debugInfo('choosing image', item);
            this.chooseImage(item);
        });
    }
}
