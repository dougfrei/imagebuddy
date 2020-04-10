import ImageBuddyDOMElement from '../ImageBuddyDOMElement';

export interface ImageSource {
	url: string;
	width: number;
	height: number;
}

export interface ImageSize {
	width: number;
	height: number;
}

export interface ImageBuddyDOMElementOptions {
	matchDPR: boolean;
	lazyLoad: boolean;
	lazyLoadThreshold: number;
	noHeight: boolean;
	ignoreHiddenCheck: boolean;
}

export interface ImageBuddyOpts {
	debug: boolean;
	matchDPR: boolean;
	lazyLoad: boolean;
	lazyLoadThreshold: number;
}

export interface ImageBuddyElements {
	queue: ImageBuddyDOMElement[];
	loaded: ImageBuddyDOMElement[];
}

export interface ImageBuddyUpdateOptions {
	parentEl?: HTMLElement;
	updateOffsetTop?: boolean;
}

export interface ImageBuddyConfig {
	events: {
		resize: string;
		scroll: string;
	};
	attributes: {
		sources: string;
		lazyLoad: string;
		lazyLoadThreshold: string;
		matchDPR: string;
		noHeight: string;
		ignoreHiddenCheck: string;
	};
	classes: {
		base: string;
		loading: string;
		loaded: string;
	};
}

export interface IThrottleEventListenerOptions {
	passive?: boolean;
	capture?: boolean;
}
