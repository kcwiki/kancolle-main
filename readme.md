Using KanColle's `main.js` in Node.js.

![npm (scoped)](https://img.shields.io/npm/v/@kancolle/main.svg)
￼![Travis (.org)](https://img.shields.io/travis/gakada/kcmain.svg)
![David](https://img.shields.io/david/gakada/kcmain.svg)
![David](https://img.shields.io/david/dev/gakada/kcmain.svg)

## Install

```sh
$ yarn add @kancolle/main
```

## Usage

```js
const main = require('@kancolle/main')

console.log(main.fn('SuffixUtil').create(156, 'ship_card'))
// 6982
```

See [`dist/api`](https://github.com/gakada/kcmain/blob/master/dist/api) for more functions (many will not work).

To start `PIXI` rendering:

```js
main.init()
```

`PIXI` globals are available.

To get scene instance:

```js
const hook = (throttle, fn) => {
  if (hook._initialized) {
    return
  }
  hook._initialized = true
  const render = PIXI.CanvasRenderer.prototype.render
  let time = new Date()
  PIXI.CanvasRenderer.prototype.render = function(...args) {
    const newTime = new Date()
    if (newTime - time > throttle) {
      time = newTime
      hook._last = args
      if (fn) {
        fn(...args)
      }
    }
    return render.apply(this, args)
  }
}

hook(1000, scene => {
  // ...
})
```

## Build

To build files in [`dist`](https://github.com/gakada/kcmain/tree/master/dist):

```sh
$ yarn
$ yarn build
```

[`dist/main.js`](https://raw.githubusercontent.com/gakada/kcmain/master/dist/main.js) is the final patched file.

## Todo

- After `main.init()` a request to `version.json` will be performed with `axios`, that won't work due to browser security related issues, more browser simulation is required. Similarly, many functions won't work without `api_start2` response. For example, `main.fn('ShipLoader').getPath` need versions from `api_start2`.
- `main.js` version in build script.
