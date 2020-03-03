const { execSync } = require('child_process')
// const { inspect } = require('util')
const { get } = require('axios')
const { readFileSync, outputFileSync } = require('fs-extra')
const beautify = require('js-beautify').js

const kcsConstUrl = `${process.env.GADGET_PROXY ? `${process.env.GADGET_PROXY}/` : ''}http://203.104.209.7/gadget_html5/js/kcs_const.js`
const kcsMainUrl = 'http://203.104.209.71/kcs2/js/main.js'

const decoderSource = readFileSync('src/decode.js').toString()
const patchSource = readFileSync('src/patch.js').toString()

const createjsSource = readFileSync('node_modules/createjs/builds/1.0.0/createjs.js').toString()
const createjsPatched = createjsSource.replace('this.createjs = this.createjs||{}', 'const createjs = {}; module.exports = createjs;')
outputFileSync('dist/createjs.js', createjsPatched)

!(async () => {
  const [, scriptVesion] = (await get(kcsConstUrl)).data.match(/scriptVesion\s*?=\s*?["'](.+?)["']/)
  outputFileSync('dist/version', scriptVesion)

  const mainSource = (await get(kcsMainUrl)).data
  const [mainDecoder, mainFormatted] = beautify(mainSource, { indent_size: 2 }).split('\n! function')
  outputFileSync('dist/decode.js', `${mainDecoder}\n${decoderSource}`)
  outputFileSync('dist/main.js', `! function${mainFormatted}`)

  execSync('node dist/decode.js')

  const mainDecoded = readFileSync('dist/main.js').toString()
  const mainPatched = mainDecoded
    .replace(/Object\.defineProperty\((\S+?), '__esModule'/g, "defineModule($1); Object.defineProperty($1, '__esModule'")
    .replace(/module\.exports = (\S+?)\(\)/, 'module.exports = registerModules($1())')

  const build = `${patchSource.replace('scriptVesion', scriptVesion)}\n${mainPatched}`
  outputFileSync(
    'dist/main.js',
    build.replace(/\\u([\d\w]{4})/gi, (_, e) => String.fromCharCode(parseInt(e, 16))),
  )
  /*
  const main = require('../dist/main')
  const api = inspect(main.modules, { maxArrayLength: 10000, depth: 10 }).replace(/\n\s*?START_TIME:\s*?\d+?,\n/g, '\n')
  outputFileSync('dist/api', api)
  */
})()
