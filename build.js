const { readFileSync, writeFileSync } = require('fs-extra')
const { get } = require('axios')
const beautify = require('js-beautify').js

const { mainVersion, version } = require('./package.json')

const main = async () => {
  const [, scriptVesion] = (await get('http://203.104.209.7/gadget_html5/js/kcs_const.js')).data.match(/scriptVesion\s*=\s*["'](.+)["']/)
  if (mainVersion !== scriptVesion) {
    console.log(`update ${mainVersion} -> ${scriptVesion}`)
  }
  writeFileSync(`${__dirname}/dist/version`, scriptVesion)

  const main = (await get('http://203.104.209.71/kcs2/js/main.js')).data
  const mainFormatted = beautify(main, { indent_size: 2 })
  const mainPatched = mainFormatted
    .replace(/Object\.defineProperty\(e, "__esModule"/g, 'defineModule(e);Object.defineProperty(e, "__esModule"')
    .replace('module.exports = e()', 'module.exports = registerModules(e())')

  const createjs = readFileSync(`${__dirname}/node_modules/createjs/builds/1.0.0/createjs.js`).toString()
  const createjsPatched = createjs.replace('this.createjs = this.createjs||{}', 'const createjs = {}; module.exports = createjs;')
  writeFileSync(`${__dirname}/dist/createjs.js`, createjsPatched)

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
 * main.js patched with defineModule and registerModules, version ${version} (${scriptVesion})
 *
 * Licence unknown, available at http://203.104.209.23/kcs2/js/main.js
 */
${mainPatched}
`
  writeFileSync(`${__dirname}/dist/main.js`, build)
  console.log('wrote dist/main.js')
}

try {
  main()
} catch (e) {
  console.error(e)
}
