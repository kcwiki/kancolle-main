const { inspect } = require('util')
const { readFileSync, outputFileSync } = require('fs-extra')
const { get } = require('axios')
const beautify = require('js-beautify').js

const { mainVersion } = require('./package.json')

const main = async () => {
  const [, scriptVesion] = (await get('http://203.104.209.7/gadget_html5/js/kcs_const.js')).data.match(/scriptVesion\s*=\s*["'](.+)["']/)
  if (mainVersion !== scriptVesion) {
    console.log(`update ${mainVersion} -> ${scriptVesion}`)
  }
  outputFileSync(`${__dirname}/dist/version`, scriptVesion)

  const mainSource = (await get('http://203.104.209.71/kcs2/js/main.js')).data
  console.log(`fetched main.js`)
  const mainFormatted = beautify(mainSource, { indent_size: 2 })
  const mainPatched = mainFormatted
    .replace(/Object\.defineProperty\(e, "__esModule"/g, 'defineModule(e);Object.defineProperty(e, "__esModule"')
    .replace('module.exports = e()', 'module.exports = registerModules(e())')

  const createjs = readFileSync(`${__dirname}/node_modules/createjs/builds/1.0.0/createjs.js`).toString()
  const createjsPatched = createjs.replace('this.createjs = this.createjs||{}', 'const createjs = {}; module.exports = createjs;')
  outputFileSync(`${__dirname}/dist/createjs.js`, createjsPatched)

  const build = `const axios = require('axios')
require('jsdom-global')()
const createjs = require('./createjs')
const PIXI = require('pixi.js')
const __modules = []
const defineModule = e => __modules.push(e)
const registerModules = e => {
  e.modules = __modules
  e.fn = name => {
    const m = __modules.find(e => e[name])
    return m && m[name]
  }
  return e
}
/**
 * main.js ${scriptVesion} patched with defineModule and registerModules
 *
 * Licence unknown, available at http://203.104.209.23/kcs2/js/main.js
 */
${mainPatched}
`
  outputFileSync(`${__dirname}/dist/main.js`, build)
  console.log('wrote dist/main.js')

  const main = require('./dist/main')

  const api = inspect(main.modules, { maxArrayLength: 10000, depth: 10 }).replace(/\n\s+START_TIME: \d+,\n/g, '\n')

  outputFileSync(`${__dirname}/dist/api`, api)
  console.log('wrote dist/api')
}

try {
  main()
} catch (e) {
  console.error(e)
}
