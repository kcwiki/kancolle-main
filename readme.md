# `@kancolle/main`

Using KanColle's `main.js` in Node.js.

[![npm package](https://img.shields.io/npm/v/@kancolle/main.svg)](https://www.npmjs.org/package/@kancolle/main)
[![dependencies](https://img.shields.io/david/kcwiki/kancolle-main.svg)](https://david-dm.org/kcwiki/kancolle-main)
[![devDependencies](https://img.shields.io/david/dev/kcwiki/kancolle-main.svg)](https://david-dm.org/kcwiki/kancolle-main?type=dev)

## Install

```sh
yarn add @kancolle/main
```

## Usage

See [`src/test.js`](https://github.com/kcwiki/kancolle-main/blob/master/src/test.js) for some working examples. See [`dist/api`](https://github.com/kcwiki/kancolle-main/blob/master/dist/api) for more functions.

## Build

To build files in [`dist`](https://github.com/kcwiki/kancolle-main/tree/master/dist):

```sh
yarn
yarn build
yarn test
```

[`dist/main.js`](https://raw.githubusercontent.com/kcwiki/kancolle-main/master/dist/main.js) is the final patched file.

## Todo

- After `main.init()` a request to `version.json` will be performed with `axios`, that won't work due to browser security related issues, more browser simulation is required. Similarly, many functions won't work without `api_start2` response. For example, `main.ShipLoader.getPath` need versions from `api_start2`.
- It is better to mock all the things rather than pulling heavy dependencies (like `canvas`).
