# Screenshot Home Assistant using Puppeteer

Experiment to easily create screenshots of your dashboards using Puppeteer. Allowing you to put them on e-ink screens or any other screen that can display images.


You will need to create a long lived access token and add it as an add-on option.

_This is a prototype, there is NO security. Anyone can access the server and make screenshots of any Home Assistant page._


## Usage

Starting the add-on will launch a new server on port 10000. Any path you request will return a screenshot of that page. You will need to specify the viewport size you want.

For example, to get a 1000px x 1000px screenshot of your default dashboard, fetch:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000
```

### e-ink displays

To reduce the color palette for e-ink displays, you can add the `eink` parameter. The value represents the number of colors (including black) to use. For example, for a 2-color e-ink display:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&eink=2
```

If you are using `eink=2`, you can also invert the colors by adding the `invert` parameter:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&eink=2&invert
```

It's recommended to use an e-ink theme like [Graphite](https://github.com/TilmanGriesel/graphite?tab=readme-ov-file#e-ink-themes) to optimize readability.

### Set Theme

You can set the theme of the Home Assistant interface for the screenshot by adding the `theme` query parameter. The value should be a theme name that Home Assistant supports (e.g., `default`, `my-custom-theme`).

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&theme=my-custom-theme
```

### Finish loading detection

By default, on a cold start the server will wait for 2.5 extra seconds after the loading is considered done, to give things that are not tracked by loading spinners to load (ie icons, pictures). When the browser is active, it waits 750ms. You can control this wait time by adding a `wait` query parameter. For example, to wait 10 seconds:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&wait=10000
```

You can control the zoom level of the page using the `zoom` query parameter. The default zoom level is 1. For example, to zoom in 1.3x:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&zoom=1.3
```

### Output formats

By default, the output format is PNG. You can request a JPEG, WebP or BMP image by adding the `format=jpeg`, `format=webp`, `format=bmp` query parameter:

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&format=jpeg
```

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&format=webp
```

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&format=bmp
```

**Note:** If the `eink` parameter is specified, the output format is limited to BMP and PNG.

### Rotate screenshot

You can rotate the screenshot by adding the `rotate` query parameter. Valid values are 90, 180, and 270.

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&rotate=90
```

### Set Language

You can set the language of the Home Assistant interface for the screenshot by adding the `lang` query parameter. The value should be a language code that Home Assistant supports (e.g., `en`, `nl`, `de`).

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&lang=nl
```

### Set Dark Mode

You can enable dark mode for the screenshot by adding the `dark` query parameter. This parameter doesn't require a value.

```
http://homeassistant.local:10000/lovelace/0?viewport=1000x1000&dark
```

### Preloading requests

To improve performance for subsequent requests, you can schedule the browser to navigate to the desired page ahead of time using the `next` parameter. Provide the number of seconds when you expect the *next* screenshot request to occur. The add-on will attempt to navigate the browser to the specified path 10 seconds *before* this timestamp.

```
# Example how the browser will warm up so it's ready to take a screenshot
# in 300 seconds.
http://homeassistant.local:10000/lovelace/0?next=300
```

Providing a `next` parameter will not affect the current request. It will only be used for the next request.

## Speed (or lack thereof)

This add-on is slow. On a Home Assistant Green, on cold-start, it takes ~10s. The browser is kept alive for up to 30 seconds.

If the same page is requested, a screenshot is returned as fast as possible (0.6s on HA Green). If a different page is requested, it takes ~1.5s because it needs to navigate.
