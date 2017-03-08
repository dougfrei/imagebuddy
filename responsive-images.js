(function() {
    var throttle = function(type, name, obj) {
        obj = obj || window;
        var running = false;
        var func = function() {
            if (running) { return; }
            running = true;
             requestAnimationFrame(function() {
                obj.dispatchEvent(new CustomEvent(name));
                running = false;
            });
        };
        obj.addEventListener(type, func);
    };

    /* init - you can init any event */
    throttle('resize', 'rImgResize');
})();

class ResponsiveImages {
    constructor(opts) {
        this.opts = Object.assign({
            debug: false,
            matchDPR: true
        }, opts);
        
        this.init();
    }

    init() {
        this.getElements();
        
        window.addEventListener('rImgResize', this.resizeHandler);
    }

    debug() {
        if (this.opts.debug) {
            console.log(...arguments);
        }
    }

    getElements() {
        this.elements = document.querySelectorAll('[data-rimg-sources]');

        this.elements.forEach((el) => {
            this.chooseImage(el);
        });
    }

    chooseImage(el) {
        const sizes = this.getSizes(el.getAttribute('data-rimg-sources'));
        const elType = el.tagName.toLowerCase();
        const container = {
            width: 0,
            height: 0
        }

        switch (elType) {
            case 'div':
                container.width = el.clientWidth;
                container.height = el.clientHeight;
                break;
            
            default:
                break;
        }

        if (this.opts.matchDPR) {
            container.width *= window.devicePixelRatio;
            container.height *= window.devicePixelRatio;
        }
        
        this.debug(container);
        this.debug(sizes);

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

        this.debug(idealImage);

        switch (elType) {
            case 'div':
                el.style.backgroundImage = `url('${idealImage.url}')`;
                break;
            
            default:
                break;
        }
    }

    getSizes(rImgSources) {
        var data = [];
        
        rImgSources.split(';').forEach(function(sizeEl) {
            var parts = sizeEl.split(',');
            
            data.push({
                url: parts[0],
                width: parseInt(parts[1]),
                height: parseInt(parts[2])
            });
        });

        return data;
    }

    resizeHandler() {
        this.debug('resizeHandler');
    }
}

window.onload = function() {
    window.rImg = new ResponsiveImages({
        debug: true,
        // matchDPR: false
    });
}