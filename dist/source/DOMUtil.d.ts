import { ImageSource, ImageSize } from './interfaces/index';
export declare function getPageYOffset(): number;
export declare function calculateElementTopOffset(el: HTMLElement): number;
/**
 * Create an array of image sizes from the "data-ib-sources" attribute
 *
 * @param {string} rImgSources
 */
export declare function getSizesFromAttribute(rImgSources: string): ImageSource[];
export declare function elementIsCached(el: Element): boolean;
export declare function shouldIgnoreElement(el: Element): boolean;
export declare function calculateUsabilityScore(containerWidth: number, containerHeight: number, imageWidth: number, imageHeight: number): number;
/**
 * Return the width of a tested element
 * This will examine a style attribute tag first and fallback to the computed style
 *
 * @param {object} el
 */
export declare function getElementWidth(el: HTMLElement): number;
/**
 * Get container dimensions of an HTML element
 *
 * @param {object} el
 * @param {bool} noHeight
 */
export declare function getContainerDimensions(el: HTMLElement, noHeight?: boolean): ImageSize;
/**
 * Creates a dummy image element and loads the requested image URL
 * Returns a promise with the loaded image URL
 *
 * @param imageURL the image URL to load
 */
export declare function loadImage(imageURL: string): Promise<string>;
export declare function compareURLs(url1: string, url2: string): boolean;
