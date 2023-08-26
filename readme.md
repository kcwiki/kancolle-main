# `@kancolle/main`

Using KanColle's `main.js` in Node.js.

[![npm package](https://img.shields.io/npm/v/@kancolle/main.svg)](https://www.npmjs.org/package/@kancolle/main)

## Install

```sh
yarn add @kancolle/main
```

## Usage

See [`src/test.js`](https://github.com/kcwiki/kancolle-main/blob/master/src/test.js) for some working examples. See [`dist/api`](https://github.com/kcwiki/kancolle-main/blob/master/dist/api) for more functions.

## Build

To build files in [`dist`](https://github.com/kcwiki/kancolle-main/tree/master/dist):

```sh
# tested with node v20, e.g.
nvm install 20
nvm use 20
# disable ignore-scripts for the following command (to build canvas)
yarn
# this will build dist/main.js, using js-beautify, as it generates shorter file than prettier
yarn build
# this will try loading dist/main.js and running src/test.js on it
yarn test
```

[`dist/main.js`](https://raw.githubusercontent.com/kcwiki/kancolle-main/master/dist/main.js) is the final patched file.

## Todo

- After `main.init()` a request to `version.json` will be performed with `axios`, that won't work due to browser security related issues, more browser simulation is required. Similarly, many functions won't work without `api_start2` response. For example, `main.ShipLoader.getPath` need versions from `api_start2`.
- It is better to mock all the things rather than pulling heavy dependencies (like `canvas`).
