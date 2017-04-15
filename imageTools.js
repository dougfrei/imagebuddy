class ImageTools {
    constructor(opts) {
        this.eventsRunning = {
            resize: false,
            scroll: false
        };

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
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.getElements();
        this.elementCache.forEach(item => {
            if (item.loaded || (item.lazyLoad && !this.canLazyLoad(item))) {
                return;
            }

            console.log('can load', item);

            this.chooseImage(item);
        });
    }

    canLazyLoad(item) {
        if (!item.lazyLoad || item.loaded) {
            return;
        }

        // console.log('check', window.scrollY, window.innerHeight, item.el.offsetTop);
        if (item.el.offsetTop - (window.scrollY + window.innerHeight) <= this.opts.lazyLoadThreshold) {
            console.info('lazy loading', item.el);
            item.loaded = true;
        }
    }

    setupEventListeners() {
        window.addEventListener('scroll', () => {
            if (this.eventsRunning.scroll) {
                return;
            }

            this.eventsRunning.scroll = true;

            requestAnimationFrame(() => {
                window.dispatchEvent(new CustomEvent(this.config.events.scroll));
                this.eventsRunning.scroll = false;
            });
        });

        window.addEventListener('resize', () => {
            if (this.eventsRunning.resize) {
                return;
            }

            this.eventsRunning.resize = true;

            requestAnimationFrame(() => {
                window.dispatchEvent(new CustomEvent(this.config.events.resize));
                this.eventsRunning.resize = false;
            });
        });
        
        window.addEventListener(this.config.events.resize, this.resizeHandler.bind(this));
        window.addEventListener(this.config.events.scroll, this.scrollHandler.bind(this));
    }

    debug() {
        if (this.opts.debug) {
            console.log(...arguments);
        }
    }

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

        console.info(this.elementCache);
    }

    getContainerDimensions(el) {
        const container = {
            width: 0,
            height: 0
        };

        switch (el.tagName.toLowerCase()) {
            case 'div':
                container.width = el.clientWidth;
                container.height = el.clientHeight;
                break;
            
            default:
                break;
        }

        return container;
    }

    getSizes(rImgSources) {
        return rImgSources
            .split(';')
            .map(sizeEl => {
                const [url, width, height] = sizeEl.split(',');
                return { url: url, width: parseInt(width), height: parseInt(height) };
            })
            .sort((a, b) => a.width > b.width ? 1 : -1);
    }

    chooseImage(item) {
        const sizes = this.getSizes(item.el.getAttribute(this.config.attributes.sources));
        const elType = item.el.tagName.toLowerCase();
        
        console.table(sizes);
        
        const container = this.getContainerDimensions(item.el);

        if (this.opts.matchDPR) {
            container.width *= window.devicePixelRatio;
            container.height *= window.devicePixelRatio;
        }
        
        // this.debug(container);
        // this.debug(sizes);

        let idealImage = false;

        sizes.forEach((size) => {
            // ensure image matches the minimum width and height of the container
            if (size.width < container.width || size.height < container.height) {
                return;
            }
            
            if (!idealImage || size.width < idealImage.width || size.height < idealImage.height) {
                idealImage = size;
            }
        });

        this.debug('ideal image', idealImage);

        switch (elType) {
            case 'div':
                item.el.style.backgroundImage = `url('${idealImage.url}')`;
                break;
            
            default:
                break;
        }

        item.loaded = true;
    }

    resizeHandler() {
        // update container sizes
        this.debug('resizeHandler');
    }

    scrollHandler() {
        // lazy load images
        this.elementCache.forEach(item => {
            if (item.loaded || (item.lazyLoad && !this.canLazyLoad(item))) {
                return;
            }

            this.chooseImage(item);
        });
    }
}