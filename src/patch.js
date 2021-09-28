/**
 * main.js version patched with defineModule and registerModules
 *
 * Licence unknown, available at http://203.104.209.71/kcs2/js/main.js
 */

global.axios = require('axios')
require('jsdom-global')()
global.createjs = require('./createjs')
global.PIXI = require('pixi.js')
global.__modules = []
global.defineModule = e => global.__modules.push(e)
global.registerModules = e => {
  for (const m of global.__modules) {
    for (const name in m) {
      e[name] = e[name] || m[name]
    }
  }
  return e
}
