/**
 * main.js scriptVesion patched with defineModule and registerModules
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
  e.modules = global.__modules
  e.fn = name => {
    const m = global.__modules.find(e => e[name])
    return m && m[name]
  }
  return e
}
