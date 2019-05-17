/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./source/ImageBuddy.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./source/ImageBuddy.js":
/*!******************************!*\
  !*** ./source/ImageBuddy.js ***!
  \******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageBuddyUtil */ "./source/ImageBuddyUtil.js");
/* harmony import */ var _ImageBuddyDebug__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageBuddyDebug */ "./source/ImageBuddyDebug.js");
/* harmony import */ var _ImageBuddyDOMElement__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./ImageBuddyDOMElement */ "./source/ImageBuddyDOMElement.js");
/* harmony import */ var _ImageBuddyEvents__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ImageBuddyEvents */ "./source/ImageBuddyEvents.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }





/**
 * ImageSelector class
 */

var ImageBuddy =
/*#__PURE__*/
function () {
  /**
   * Constructor
   *
   * @param {object} opts
   */
  function ImageBuddy(opts) {
    var _this = this;

    _classCallCheck(this, ImageBuddy);

    _defineProperty(this, "resizeHandler", function () {
      // cycle through loaded images and see if we need to select a different source
      for (var i = 0; i < _this.elements.loaded.length; i++) {
        var item = _this.elements.loaded[i];
        var dimensions = item.getContainerDimensions();

        if (dimensions.width > item.currentSize.width || !item.noHeight && dimensions.height > item.currentSize.height) {
          _this.debugger.debug('swapping image');

          item.chooseImage();
        }
      } // re-calculate top offsets for images in the queue


      for (var _i = 0; _i < _this.elements.queue.length; _i++) {
        _this.elements.queue[_i].calculateElementTopOffset();
      } // load any unprocessed cache elements


      _this.processElementQueue();
    });

    _defineProperty(this, "scrollHandler", function () {
      // lazy load images
      _this.processElementQueue();
    });

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
        resize: 'ImageBuddyResize',
        scroll: 'ImageBuddyScroll'
      },
      attributes: {
        // enabled: 'data-ib-enabled',
        sources: 'data-ib-sources',
        lazyLoad: 'data-ib-lazyload',
        lazyLoadThreshold: 'data-ib-lazyload-threshold',
        matchDPR: 'data-ib-match-dpr',
        noHeight: 'data-ib-no-height'
      },
      classes: {
        base: 'ib__image',
        loading: 'ib__image--loading',
        loaded: 'ib__image--loaded'
      }
    }; // create default options and merge any overrides

    this.opts = Object.assign({
      debug: false,
      matchDPR: true,
      lazyLoad: true,
      lazyLoadThreshold: 100
    }, opts);
    this.debugger = new _ImageBuddyDebug__WEBPACK_IMPORTED_MODULE_1__["default"](this.opts.debug); // this.resizeHandler = this.resizeHandler.bind(this);
    // this.scrollHandler = this.scrollHandler.bind(this);

    this.setupEventListeners();
    this.update();
  }

  _createClass(ImageBuddy, [{
    key: "processElementQueue",
    value: function processElementQueue() {
      var numProcessed = 0;

      if (!this.elements.queue.length) {
        return numProcessed;
      }

      for (var i = 0; i < this.elements.queue.length; i++) {
        var item = this.elements.queue[i];

        if (item.options.lazyLoad && item.canLazyLoad(item) === false) {
          continue;
        }

        item.chooseImage(); // move to loaded array

        this.elements.queue.splice(i, 1);
        this.elements.loaded.push(item);
        i--;
        numProcessed++;
      }

      return numProcessed;
    }
  }, {
    key: "update",
    value: function update() {
      var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var t1 = performance.now();
      var parentEl = opts.parentEl || document;
      var newElements = this.getElements(parentEl);
      var updateOffsetTop = opts.updateOffsetTop || false;
      this.elements.queue = this.elements.queue.concat(newElements);
      this.debugger.debugInfo(this.elements.queue);

      if (updateOffsetTop) {
        for (var i = 0; i < this.elements.queue.length; i++) {
          this.elements.queue[i].calculateElementTopOffset();
        }
      }

      var numProcessed = this.processElementQueue();
      var t2 = performance.now();
      this.debugger.debug('ImageBuddy: update complete', "".concat(numProcessed, " elements"), "".concat(Math.round(t2 - t1), "ms"));
      _ImageBuddyEvents__WEBPACK_IMPORTED_MODULE_3__["default"].emit('update');
    }
    /**
     * Setup and throttle event listeners -- scroll & resize
     */

  }, {
    key: "setupEventListeners",
    value: function setupEventListeners() {
      _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__["default"].throttleEventListener('resize', this.resizeHandler, {
        passive: true
      });
      _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__["default"].throttleEventListener('scroll', this.scrollHandler, {
        passive: true
      });
    }
    /**
     * Get all the HTML elements configured for image selection
     */

  }, {
    key: "getElements",
    value: function getElements(parentEl) {
      var elements = [];
      var foundEls = parentEl.querySelectorAll("[".concat(this.config.attributes.sources, "]"));

      for (var i = 0; i < foundEls.length; i++) {
        var el = foundEls[i]; // const offsetTop = el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
        // attribute that can be used to ignore specific images when loading

        if (_ImageBuddyDOMElement__WEBPACK_IMPORTED_MODULE_2__["default"].isCached(el) || _ImageBuddyDOMElement__WEBPACK_IMPORTED_MODULE_2__["default"].shouldIgnore(el)) {
          continue;
        }

        elements.push(new _ImageBuddyDOMElement__WEBPACK_IMPORTED_MODULE_2__["default"](el, this.config, this.opts));
      }

      return elements;
    }
    /**
     * Resize handler
     */

  }], [{
    key: "on",
    value: function on(event, listener) {
      _ImageBuddyEvents__WEBPACK_IMPORTED_MODULE_3__["default"].on(event, listener);
    }
  }]);

  return ImageBuddy;
}();

/* harmony default export */ __webpack_exports__["default"] = (ImageBuddy);

/***/ }),

/***/ "./source/ImageBuddyDOMElement.js":
/*!****************************************!*\
  !*** ./source/ImageBuddyDOMElement.js ***!
  \****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _default; });
/* harmony import */ var _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ImageBuddyUtil */ "./source/ImageBuddyUtil.js");
/* harmony import */ var _ImageBuddyEvents__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./ImageBuddyEvents */ "./source/ImageBuddyEvents.js");
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }




var _default =
/*#__PURE__*/
function () {
  function _default(el, itConfig, itOpts) {
    _classCallCheck(this, _default);

    el.classList.add(itConfig.classes.base);
    el.setAttribute('data-ib-cache-id', _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__["default"].getUniqueId());
    this.el = el;
    this.config = itConfig;
    this.elType = el.tagName.toLowerCase();
    this.cacheId = el.getAttribute('data-ib-cache-id'); // this.offsetTop = this.calculateElementTopOffset(el);

    this.sizes = this.getSizes(el.getAttribute(itConfig.attributes.sources));
    this.currentSize = false;
    this.loaded = false; // FIXME: figure out a way to check if images are already loaded when this array is created

    this.isLoading = false;
    this.options = {
      lazyLoad: el.getAttribute(itConfig.attributes.lazyLoad) ? _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__["default"].parseBooleanString(el.getAttribute(itConfig.attributes.lazyLoad)) : itOpts.lazyLoad,
      lazyLoadThreshold: el.getAttribute(itConfig.attributes.lazyLoadThreshold) ? el.getAttribute(itConfig.attributes.lazyLoadThreshold) : itOpts.lazyLoadThreshold,
      matchDPR: el.getAttribute(itConfig.attributes.matchDPR) ? _ImageBuddyUtil__WEBPACK_IMPORTED_MODULE_0__["default"].parseBooleanString(el.getAttribute(itConfig.attributes.matchDPR)) : itOpts.matchDPR,
      noHeight: el.getAttribute(itConfig.attributes.noHeight) ? el.getAttribute(itConfig.attributes.noHeight) : false
    };
    this.calculateElementTopOffset();
  }

  _createClass(_default, [{
    key: "calculateElementTopOffset",
    value: function calculateElementTopOffset() {
      this.offsetTop = this.el.getBoundingClientRect().top + (window.pageYOffset || document.documentElement.scrollTop);
    }
    /**
     * Create an array of image sizes from the "data-ib-sources" attribute
     *
     * @param {string} rImgSources
     */

  }, {
    key: "getSizes",
    value: function getSizes(rImgSources) {
      return rImgSources.split(',').map(function (sizeEl) {
        var _sizeEl$trim$split = sizeEl.trim().split(' '),
            _sizeEl$trim$split2 = _slicedToArray(_sizeEl$trim$split, 3),
            url = _sizeEl$trim$split2[0],
            width = _sizeEl$trim$split2[1],
            height = _sizeEl$trim$split2[2];

        return {
          url: url,
          width: parseInt(width),
          height: parseInt(height)
        };
      }).sort(function (a, b) {
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

  }, {
    key: "canLazyLoad",
    value: function canLazyLoad() {
      if (!this.options.lazyLoad || this.loaded) {
        return false;
      }

      if (this.offsetTop - (window.pageYOffset + window.innerHeight) <= this.options.lazyLoadThreshold) {
        return true;
      }

      return false;
    }
  }, {
    key: "chooseImage",

    /**
     * Choose the appropriate image and apply it to the element
     *
     * @param {object} item
     */
    value: function chooseImage() {
      var _this = this;

      if (this.isLoading) {
        return;
      }

      this.isLoading = true;
      var sizes = this.getSizes(this.el.getAttribute(this.config.attributes.sources));
      var elType = this.el.tagName.toLowerCase();

      if (elType === 'img' && parseInt(getComputedStyle(this.el).width) <= 1) {
        this.el.style.width = '100%';
      }

      var container = this.getContainerDimensions();

      if (this.options.matchDPR) {
        container.width *= window.devicePixelRatio;
        container.height *= window.devicePixelRatio;
      }

      var scoredSizes = sizes.map(function (size) {
        size.score = _this.calculateUsabilityScore(container.width, container.height, size.width, size.height);
        return size;
      });
      scoredSizes.sort(function (a, b) {
        return a.score - b.score;
      }); // ImageBuddyUtil.debugTable(scoredSizes);

      var idealImage = scoredSizes[scoredSizes.length - 1]; // ImageBuddyUtil.debug(idealImage);

      this.loadImage(idealImage.url, function () {
        _this.loaded = true;
        _this.isLoading = false;
        _this.currentSize = {
          width: idealImage.width,
          height: idealImage.height
        };

        _this.el.classList.remove(_this.config.classes.loading);

        _this.el.classList.add(_this.config.classes.loaded);

        _ImageBuddyEvents__WEBPACK_IMPORTED_MODULE_1__["default"].emit('image-loaded', _this.el);
      });
    }
  }, {
    key: "calculateUsabilityScore",
    value: function calculateUsabilityScore(containerWidth, containerHeight, imageWidth, imageHeight) {
      // ImageBuddyUtil.debug(`container: ${containerWidth}x${containerHeight}`, `image: ${imageWidth}x${imageHeight}`);
      var score = 1;

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

  }, {
    key: "getContainerDimensions",
    value: function getContainerDimensions() {
      // FIXME:
      // this is tricky since an IMG tag may not have a set height and we can't rely on
      // its container for that height value
      // I'm thinking the best way to tackle this is to see if the element has a height
      // specified -- if not we'll disregard the height value
      //      - how does a 100% height work with this?
      // el.clientHeight works fine on all tags except IMG
      var displayStyle = this.el.style.display ? this.el.style.display : window.getComputedStyle(this.el).display;
      var container = {
        width: displayStyle === 'block' ? this.el.clientWidth : 0,
        height: this.el.clientHeight ? this.el.clientHeight : 0 // TODO: try `parseInt(window.getComputedStyle(el).height)` here

      };

      if (!container.width) {
        container.width = this.getElementWidth(this.el.parentElement);
      }

      if (this.options.noHeight) {
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

  }, {
    key: "getElementWidth",
    value: function getElementWidth(el) {
      var displayStyle = el.style.display ? el.style.display : window.getComputedStyle(el).display;

      if (displayStyle !== 'block' && el.parentElement) {
        return this.getElementWidth(el.parentElement);
      }

      return el.clientWidth;
    }
  }, {
    key: "loadImage",
    value: function loadImage(imgSrc, callback) {
      var imageLoader = new Image();
      var el = this.el;

      imageLoader.onload = function () {
        if (el.tagName.toLowerCase() === 'img') {
          el.setAttribute('src', this.src);
        } else {
          el.style.backgroundImage = "url('".concat(this.src, "')");
        }

        if (callback && typeof callback == 'function') {
          callback();
        }
      };

      imageLoader.src = imgSrc;
    }
  }], [{
    key: "isCached",
    value: function isCached(el) {
      return el.getAttribute('data-ib-cache-id') && !el.hasAttribute('data-ib-no-cache');
    }
  }, {
    key: "shouldIgnore",
    value: function shouldIgnore(el) {
      return el.hasAttribute('data-ib-ignore');
    }
  }]);

  return _default;
}();



/***/ }),

/***/ "./source/ImageBuddyDebug.js":
/*!***********************************!*\
  !*** ./source/ImageBuddyDebug.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _default; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default() {
    var enabled = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    _classCallCheck(this, _default);

    this.enabled = enabled;
  }

  _createClass(_default, [{
    key: "debug",
    value: function debug() {
      if (this.enabled) {
        var _console;

        (_console = console).log.apply(_console, arguments);
      }
    }
  }, {
    key: "debugInfo",
    value: function debugInfo() {
      if (this.enabled) {
        var _console2;

        (_console2 = console).info.apply(_console2, arguments);
      }
    }
  }, {
    key: "debugTable",
    value: function debugTable() {
      if (this.enabled) {
        var _console3;

        (_console3 = console).table.apply(_console3, arguments);
      }
    }
  }]);

  return _default;
}();



/***/ }),

/***/ "./source/ImageBuddyEvents.js":
/*!************************************!*\
  !*** ./source/ImageBuddyEvents.js ***!
  \************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _default; });
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, null, [{
    key: "on",
    value: function on(event, listener) {
      if (typeof window.itEvents === 'undefined') {
        window.itEvents = {};
      }

      if (_typeof(window.itEvents[event]) !== 'object') {
        window.itEvents[event] = [];
      }

      window.itEvents[event].push(listener);
    }
  }, {
    key: "emit",
    value: function emit(event) {
      var _this = this,
          _arguments = arguments;

      if (typeof window.itEvents === 'undefined') {
        window.itEvents = {};
      } // allow handlers to register themselves before executing


      setTimeout(function () {
        if (_typeof(window.itEvents[event]) === 'object') {
          var listeners = window.itEvents[event].slice();
          var length = listeners.length;
          var args = [].slice.call(_arguments, 1);

          for (var i = 0; i < length; i++) {
            listeners[i].apply(_this, args);
          }
        }
      }, 0);
    }
  }]);

  return _default;
}();



/***/ }),

/***/ "./source/ImageBuddyUtil.js":
/*!**********************************!*\
  !*** ./source/ImageBuddyUtil.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _default; });
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _default =
/*#__PURE__*/
function () {
  function _default() {
    _classCallCheck(this, _default);
  }

  _createClass(_default, null, [{
    key: "getUniqueId",
    value: function getUniqueId() {
      var prefix = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

      if (!this.uidCounter) {
        this.uidCounter = 0;
      }

      return "".concat(prefix).concat(++this.uidCounter);
    }
  }, {
    key: "parseBooleanString",
    value: function parseBooleanString(boolStr) {
      if (typeof boolStr === 'string' && boolStr.toLowerCase() === 'true') {
        return true;
      }

      return Boolean(parseInt(boolStr));
    }
  }, {
    key: "passiveEventListenerSupported",
    value: function passiveEventListenerSupported() {
      // check for passive event listener support
      var passiveSupported = false;

      try {
        var options = Object.defineProperty({}, 'passive', {
          get: function get() {
            passiveSupported = true;
          }
        });
        window.addEventListener('test', null, options);
      } catch (err) {}

      return passiveSupported;
    }
    /**
     * Setup a throttled event listener
     *
     * @param {string} name
     * @param {function} callback
     * @param {object} options
     */

  }, {
    key: "throttleEventListener",
    value: function throttleEventListener(eventName, callback, options) {
      var _this = this;

      var passiveSupported = this.passiveEventListenerSupported();
      options.passive = typeof options.passive === 'undefined' ? true : options.passive;
      options.capture = typeof options.capture === 'undefined' ? false : options.capture;

      if (!this.eventsRunning) {
        this.eventsRunning = {};
      }

      if (!this.eventsRunning.hasOwnProperty(eventName)) {
        this.eventsRunning[eventName] = false;
      }

      window.addEventListener(eventName, function () {
        if (_this.eventsRunning[eventName]) {
          return;
        }

        _this.eventsRunning[eventName] = true;
        requestAnimationFrame(function () {
          window.dispatchEvent(new CustomEvent("".concat(eventName, "-throttled")));
          _this.eventsRunning[eventName] = false;
        });
      }, passiveSupported ? options : options.capture);

      if (typeof callback === 'function') {
        window.addEventListener("".concat(eventName, "-throttled"), callback, passiveSupported ? options : options.capture);
      }
    }
  }]);

  return _default;
}();



/***/ })

/******/ });
//# sourceMappingURL=imagebuddy.esm.js.map