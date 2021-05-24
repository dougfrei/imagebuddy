function e(){return(e=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e}).apply(this,arguments)}var t=function(){function e(e){void 0===e&&(e=!1),this.enabled=e}var t=e.prototype;return t.debug=function(){var e;this.enabled&&(e=console).log.apply(e,[].slice.call(arguments))},t.debugInfo=function(){var e;this.enabled&&(e=console).info.apply(e,[].slice.call(arguments))},t.debugTable=function(){var e;this.enabled&&(e=console).table.apply(e,[].slice.call(arguments))},e}(),n={},i=function(){function e(){}return e.on=function(e,t){"object"!=typeof n[e]&&(n[e]=[]),n[e].push(t)},e.emit=function(e){var t=[].slice.call(arguments,1);setTimeout(function(){if("object"==typeof n[e])for(var i=n[e].slice(),s=0;s<i.length;s++)i[s].apply(null,t)},0)},e}();function s(e){var t=e.trim().toLowerCase();return"true"===t||"false"!==t&&parseInt(t,10)>0}function r(){return void 0!==window.pageYOffset?window.pageYOffset:(document.scrollingElement||document.documentElement).scrollTop}function o(e){return e.getBoundingClientRect().top+r()}function a(e){return e.trim()?e.split(",").map(function(e){var t=e.trim().split(" "),n=t[2];return{url:t[0],width:parseInt(t[1],10),height:parseInt(n,10)}}).sort(function(e,t){return e.width>=e.height?e.width>t.width?1:-1:e.height>t.height?1:-1}):[]}function u(e){return!!e&&!e.hasAttribute("data-ib-no-cache")&&!!e.getAttribute("data-ib-cache-id")}function l(e){return e.hasAttribute("data-ib-ignore")}function h(e,t){void 0===t&&(t=!1);var n={width:"block"===(e.style.display?e.style.display:window.getComputedStyle(e).display)?e.clientWidth:0,height:e.clientHeight?e.clientHeight:0};return!n.width&&e.parentElement&&(n.width=function e(t){return"block"!==(t.style.display?t.style.display:window.getComputedStyle(t).display)&&t.parentElement?e(t.parentElement):t.clientWidth}(e.parentElement)),t&&(n.height=0),n}var d=function(){function e(e,t,n){e.classList.add(t.classes.base),e.setAttribute("data-ib-cache-id",Math.random().toString(36).substring(7)),this.el=e,this.config=t,this.elType=e.tagName.toLowerCase(),this.sizes=a(e.getAttribute(t.attributes.sources)||""),this.currentSize={width:0,height:0},this.loaded=!1,this.isLoading=!1,this.options={lazyLoad:e.hasAttribute(t.attributes.lazyLoad)?s(e.getAttribute(t.attributes.lazyLoad)||""):n.lazyLoad,lazyLoadThreshold:e.hasAttribute(t.attributes.lazyLoadThreshold)?parseInt(e.getAttribute(t.attributes.lazyLoadThreshold)||"0",10):n.lazyLoadThreshold,matchDPR:e.hasAttribute(t.attributes.matchDPR)?s(e.getAttribute(t.attributes.matchDPR)||""):n.matchDPR,noHeight:!!e.hasAttribute(t.attributes.noHeight)&&s(e.getAttribute(t.attributes.noHeight)||""),ignoreHiddenCheck:!!e.hasAttribute(t.attributes.ignoreHiddenCheck)&&s(e.getAttribute(t.attributes.ignoreHiddenCheck)||"")},this.offsetTop=o(this.el)}var t=e.prototype;return t.updateTopOffset=function(){this.offsetTop=o(this.el)},t.canLazyLoad=function(){return!(!this.options.lazyLoad||this.loaded)&&this.offsetTop-(r()+window.innerHeight)<=this.options.lazyLoadThreshold},t.chooseImage=function(){try{var e=this;if(e.isLoading)return Promise.resolve();if(!e.options.ignoreHiddenCheck&&e.isHidden())return Promise.resolve();e.isLoading=!0;var t=a(e.el.getAttribute(e.config.attributes.sources)||"");"img"===e.el.tagName.toLowerCase()&&parseInt(getComputedStyle(e.el).width||"0",10)<=1&&(e.el.style.width="100%");var n=h(e.el,e.options.noHeight);e.options.matchDPR&&(n.width*=window.devicePixelRatio,n.height*=window.devicePixelRatio);var s=t.map(function(e){return Object.assign(e,{score:(t=n.width,i=n.height,s=e.width,r=e.height,o=1,s>=t?o*=t/s:o-=Math.abs(t-s),i&&(r>=i?o*=i/r:o-=Math.abs(i-r)),o)});var t,i,s,r,o});s.sort(function(e,t){return e.score-t.score});var r=s[s.length-1];if((u=[e.el.getAttribute("src")||"",r.url].map(function(e){var t=document.createElement("a");return t.href=e.toLowerCase(),t.host+t.pathname}))[0]===u[1])return Promise.resolve();var o=function(t,n){try{var s=Promise.resolve((o=r.url,new Promise(function(e,t){var n=new Image;n.onload=function(){e(n.src)},n.onerror=function(){t(n.src)},n.src=o}))).then(function(t){"img"===e.el.tagName.toLowerCase()?e.el.setAttribute("src",t):e.el.style.backgroundImage="url('"+t+"')",e.loaded=!0,e.isLoading=!1,e.currentSize={width:r.width,height:r.height},e.el.classList.remove(e.config.classes.loading),e.el.classList.add(e.config.classes.loaded),i.emit("image-loaded",e.el)})}catch(e){return n()}var o;return s&&s.then?s.then(void 0,n):s}(0,function(){console.error("error loading image",r.url)});return Promise.resolve(o&&o.then?o.then(function(){}):void 0)}catch(e){return Promise.reject(e)}var u},t.isHidden=function(){return null===this.el.offsetParent},e}();module.exports=function(){function n(n){var i=this;this.resizeHandler=function(){for(var e=0;e<i.elements.loaded.length;e++){var t=i.elements.loaded[e],n=h(t.el,t.options.noHeight);(n.width>t.currentSize.width||!t.options.noHeight&&n.height>t.currentSize.height)&&(i.debugger.debug("swapping image"),t.chooseImage())}for(var s=0;s<i.elements.queue.length;s++)i.elements.queue[s].updateTopOffset();i.processElementQueue()},this.scrollHandler=function(){i.processElementQueue()},this.eventsRunning={},this.elements={queue:[],loaded:[]},this.config={events:{resize:"ImageBuddyResize",scroll:"ImageBuddyScroll"},attributes:{sources:"data-ib-sources",lazyLoad:"data-ib-lazyload",lazyLoadThreshold:"data-ib-lazyload-threshold",matchDPR:"data-ib-match-dpr",noHeight:"data-ib-no-height",ignoreHiddenCheck:"data-ib-ignore-hidden-check"},classes:{base:"ib__image",loading:"ib__image--loading",loaded:"ib__image--loaded"}},this.opts=e({debug:!1,matchDPR:!0,lazyLoad:!0,lazyLoadThreshold:100},n),this.debugger=new t(this.opts.debug),this.setupEventListeners(),this.update()}var s=n.prototype;return s.processElementQueue=function(){var e=0;if(!this.elements.queue.length)return e;for(var t=0;t<this.elements.queue.length;t++){var n=this.elements.queue[t];n.options.lazyLoad&&!1===n.canLazyLoad()||(n.chooseImage(),this.elements.queue.splice(t,1),this.elements.loaded.push(n),t--,e++)}return e},s.update=function(e){void 0===e&&(e={});var t=performance.now(),n=e.parentEl||document.documentElement,s=this.getElements(n),r=e.updateOffsetTop||!1;if(this.elements.queue=this.elements.queue.concat(s),this.debugger.debugInfo(this.elements.queue),r)for(var o=0;o<this.elements.queue.length;o++)this.elements.queue[o].updateTopOffset();var a=this.processElementQueue(),u=performance.now();this.debugger.debug("ImageBuddy: update complete",a+" elements",Math.round(u-t)+"ms"),i.emit("update")},s.setupEventListeners=function(){this.throttleEventListener("resize",this.resizeHandler,{passive:!0}),this.throttleEventListener("scroll",this.scrollHandler,{passive:!0})},s.getElements=function(e){for(var t=[],n=e.querySelectorAll("["+this.config.attributes.sources+"]"),i=0;i<n.length;i++){var s=n[i];u(s)||l(s)||t.push(new d(s,this.config,this.opts))}return t},s.throttleEventListener=function(e,t,n){var i=this,s=this.passiveEventListenerSupported(),r=Object.assign(n,{passive:void 0===n.passive||n.passive,capture:void 0!==n.capture&&n.capture});this.eventsRunning||(this.eventsRunning={}),Object.prototype.hasOwnProperty.call(this.eventsRunning,e)||(this.eventsRunning[e]=!1),window.addEventListener(e,function(){i.eventsRunning[e]||(i.eventsRunning[e]=!0,requestAnimationFrame(function(){window.dispatchEvent(new CustomEvent(e+"-throttled")),i.eventsRunning[e]=!1}))},s?r:r.capture),"function"==typeof t&&window.addEventListener(e+"-throttled",t,s?r:r.capture)},s.passiveEventListenerSupported=function(){var e=!1;try{var t=Object.defineProperty({},"passive",{get:function(){return e=!0,!0}});window.addEventListener("test",function(){},t)}catch(e){}return e},n.on=function(e,t){i.on(e,t)},n}();
//# sourceMappingURL=imagebuddy.js.map