class ImageTools {
    constructor(opts) {
        this.resizeRunning = false;
        this.elementCache = [];
        this.config = {
            events: {
                resize: 'imageToolsResize'
            },
            attributes: {
                sources: 'data-it-sources'
            }
        };

        this.opts = Object.assign({
            debug: false,
            matchDPR: true
        }, opts);
        
        this.init();
    }

    init() {
        this.setupResizeListener();
        this.getElements();
        this.elementCache.forEach(item => this.chooseImage(item.el));
    }

    setupResizeListener() {
        window.addEventListener('resize', () => {
            if (this.resizeRunning) {
                return;
            }

            this.resizeRunning = true;

            requestAnimationFrame(() => {
                window.dispatchEvent(new CustomEvent(this.config.events.resize));
                this.resizeRunning = false;
            });
        });
        
        window.addEventListener(this.config.events.resize, this.resizeHandler.bind(this));
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
                sizes: this.getSizes(el.getAttribute(this.config.attributes.sources))
            });
        });
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

    chooseImage(el) {
        const sizes = this.getSizes(el.getAttribute(this.config.attributes.sources));
        const elType = el.tagName.toLowerCase();
        
        console.table(sizes);
        
        const container = this.getContainerDimensions(el);

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
                el.style.backgroundImage = `url('${idealImage.url}')`;
                break;
            
            default:
                break;
        }
    }

    resizeHandler() {
        // update container sizes
        this.debug('resizeHandler');
    }
}