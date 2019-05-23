# ImageBuddy
ImageBuddy is a JavaScript library that will dynamically set the `src` attribute of an image or the `background-image` property of an element.

## HTML setup
### Transparent PNG placeholder
A 10000x1 base64-encoded transparent PNG should be used as placeholder for the `src` attribute on `img` elements. It can be used as the the `background-image` style placeholder on all other types of elements although it is not required.

Here is an example of the `src` attribute with the transparent PNG placeholder:

```
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAJxAAAAABCAYAAAB43rQLAAAAQElEQVR42u3BAQ0AAAgDoJvc6HczBzBNNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwDtsOwGAKz8gLwAAAABJRU5ErkJggg=="
```

##### Why a 10000x1 transparent image?
A typical 1x1 transparent image will scale on an `img` tag that doesn't have a set height and throw off the ability to calculate height. The 10000x1 transparent image does not scale above 1px in height in all tested width scenarios and allows us to see the caclulated height as 0 which lets us choose an image based on width alone.

##### Fallback for browsers with JavaScript disabled
```
<noscript>
	<img src="your-fallback-image.jpg" alt="">
</noscript>
```

### Element Attributes

#### `data-ib-sources` (string)
Specify the possible images for the element with the following format `<url> <width> <height>`. Separate images using commas:

```
data-ib-sources="image-320x180 320w 180h, image-533x300.jpg 533w 300h, image-854x480.jpg 854w 480h, image-1280x720.jpg 1280w 720h, image-1440x810.jpg 1440w 810h, image-1920x1080.jpg 1920w 1080h"
```

#### `data-ib-lazyload` (0 | 1)
Enable/disable lazy-loading for a specific element. This setting overrides the global setting specified during instantiation.

#### `data-ib-lazyload-threshold` (number)
Set the lazy-loading threshold for a specific element. This setting overrides the global setting specified during instantiation.

#### `data-ib-match-dpr` (0 | 1)
Set the DPR match setting for a specific element. This setting overrides the global setting specified during instantiation.

#### `data-ib-no-height` (0 | 1)
Restrict ImageBuddy from considering the height of an image when determining which image will be used.

#### `data-ib-no-cache` (0 | 1)
Prevent ImageBuddy from caching the element in case it is duplicated. For example, when using image carousel plugins, duplicate slides can be created that clone the image element after a cache id is setup but before an image URL is chosen. This results in blank slides at the beginning/end of a loop that will never have images selected.

#### `data-ib-ignore` (0 | 1)
Prevent an element from being processed during the initial processing and any subsequent `.update()` calls. If this value is changed to `0` and `.update()` is run, the element will be processed.


## JavaScript setup

### Setup
ImageBuddy can be included in your project via NPM:

`npm install imagebuddy`

and then imported when needed

`import ImageBuddy from 'imagebuddy'`

Alternatively, ImageBuddy can be included manually using the built version included in the `dist` path:

`<script src="imagebuddy.browser.min.js"></script>`


### Instantiation
```
const ib = new ImageBuddy({
	// print debug information to the console while ImageBuddy is running
	debug: false,

	// Use the devicePixelRatio value of the browser as a multiplier when selecting image sizes
	// https://developer.mozilla.org/en-US/docs/Web/API/Window/devicePixelRatio
	matchDPR: false,

	// Enable/disable lazy-loading for all elements
	lazyLoad: true,

	// Set the distance of elements (in pixels) from the bottom of the
	// browser viewport where the lazy-loading functionality will activate.
	lazyLoadThreshold: 100
});
```

### Instance Methods

#### `update(opts = {})`

Update all images controlled by ImageBuddy and also look for new elements that have been created since the last update.

Default options:

```
{
	// Control the parent element whose children will be updated
	parentEl: document,

	// Re-calculate the top offset of the image elements.
	// This can be useful when the width of a container or page changes.
	updateOffsetTop: false
}
```


### Static Methods

#### `on(event, callback)`

Attach an event listener for the following events that are dispatched by ImageBuddy:

##### `update`
Runs when the update process is complete. No arguments are passed to the callback function.

```
ImageBuddy.on('update', () => {
	console.log('ImageBuddy update is complete');
});
```

##### `image-loaded`
Runs when an image has been selected by ImageBuddy and it has loaded. The element modified is passed to the callback function.

```
ImageBuddy.on('image-loaded', (el) => {
	console.log('image loaded', el);
});
```
