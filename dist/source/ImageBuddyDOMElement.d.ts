import { ImageSource, ImageSize, ImageBuddyDOMElementOptions, ImageBuddyConfig, ImageBuddyOpts } from './interfaces/index';
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
    constructor(el: HTMLElement, ibConfig: ImageBuddyConfig, ibOpts: ImageBuddyOpts);
    updateTopOffset(): void;
    /**
     * Test if an item is lazy load-able
     *
     * @param {object} item
     */
    canLazyLoad(): boolean;
    /**
     * Choose the appropriate image and apply it to the element
     *
     * @param {object} item
     */
    chooseImage(): Promise<void>;
}
