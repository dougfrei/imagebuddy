import ImageBuddyDebug from './ImageBuddyDebug';
import ImageBuddyDOMElement from './ImageBuddyDOMElement';
import { ImageBuddyOpts, ImageBuddyElements, ImageBuddyUpdateOptions, ImageBuddyConfig, IThrottleEventListenerOptions } from './interfaces/index';
declare class ImageBuddy {
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
    constructor(opts: Partial<ImageBuddyOpts>);
    processElementQueue(): number;
    update(opts?: ImageBuddyUpdateOptions): void;
    /**
     * Setup and throttle event listeners -- scroll & resize
     */
    setupEventListeners(): void;
    /**
     * Get all the HTML elements configured for image selection
     */
    getElements(parentEl: HTMLElement): ImageBuddyDOMElement[];
    /**
     * Resize handler
     */
    resizeHandler: () => void;
    /**
     * Scroll handler -- check for lazy load-able images
     */
    scrollHandler: () => void;
    /**
     * Setup a throttled event listener
     *
     * @param {string} name
     * @param {function} callback
     * @param {object} options
     */
    throttleEventListener(eventName: string, callback: EventListenerOrEventListenerObject, userOptions: IThrottleEventListenerOptions): void;
    passiveEventListenerSupported(): boolean;
    static on(event: string, listener: CallableFunction): void;
}
export default ImageBuddy;
