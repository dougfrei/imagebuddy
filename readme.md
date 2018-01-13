# ImageTools
ImageTools is a JavaScript library that will dynamically set the `src` attribute of an image or the `background-image` style of a container.

## HTML setup
### Transparent PNG placeholder
A 10000x1 base64-encoded transparent PNG should be used as placeholder for the `src` attribute on `img` elements. It can be used as the the `background-image` style placeholder on all other types of elements although it is not required.

Here is an example of the `src` attribute with the transparent PNG placeholder:

```
src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAJxAAAAABCAYAAAB43rQLAAAAQElEQVR42u3BAQ0AAAgDoJvc6HczBzBNNgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwDtsOwGAKz8gLwAAAABJRU5ErkJggg=="
```

##### Why a 10000x1 transparent image?
A typical 1x1 transparent image will scale on an `img` tag that doesn't have a set height and throw off the ability to calculate height. The 10000x1 transparent image does not scale above 1px in height in all tested width scenarios and allows us to see the caclulated height as 0 which lets us choose an image based on width alone.

##### `data-it-no-height` attribute
Alternatively, to restrict the library from considering the height of an image, place a `data-it-no-height="true"` attribute on the element.

### `it-sources` attribute
Create a `data-it-sources` attribute with the following format `url,width,height` and separate each item with a semicolon

```
data-it-sources="assets/images/landscape-16x9-320x180.jpg,320,180;assets/images/landscape-16x9-533x300.jpg,533,300;assets/images/landscape-16x9-854x480.jpg,854,480;assets/images/landscape-16x9-1280x720.jpg,1280,720;assets/images/landscape-16x9-1440x810.jpg,1440,810;assets/images/landscape-16x9-1920x1080.jpg,1920,1080"
```

#### Fallback for disabled/non-existant JavaScript
```
<noscript>
	<img src="your-fallback-image.jpg" alt="">
</noscript>
```

## JavaScript setup
### Instantiation
```
window.onload = function() {
    window.imageTools = new ImageTools({
        debug: false,
        matchDPR: false,
        lazyLoad: true,
        lazyLoadThreshold: 100
    });
}
```

### Manual reloading
```
window.imageTools.update();
```

## Future Features
* Browser resize detection and loading of new images if needed
* MutationObserver for detection of elements with `data-it-sources` attributes that have been dynamically added

## Changelog
### 0.3.3
* Added `data-it-no-cache` attribute option that can help with plugins like Swiper. In this case, Swiper creates duplicate slides in its loop mode that clone the image element after a cache id is setup but before an image URL is chosen. This results in blank slides at the beginning/end of a loop that will never have images selected.