const { spawnSync } = require('child_process')
const { inspect } = require('util')
const { get } = require('axios')
const { readFileSync, outputFileSync, removeSync, existsSync } = require('fs-extra')
const beautify = require('js-beautify').js

const file = path => readFileSync(path).toString()

outputFileSync(
  'dist/createjs.js',
  file('node_modules/createjs/builds/1.0.0/createjs.js').replace(
    'this.createjs = this.createjs||{}',
    'const createjs = {}; module.exports = createjs;',
  ),
)

const debug = process.argv[2] === '-d'

!(async () => {
  const main =
    debug && existsSync('dist/main0.js')
      ? readFileSync('dist/main0.js').toString()
      : beautify((await get('http://203.104.209.71/kcs2/js/main.js')).data, { indent_size: 2 })

  if (debug) {
    outputFileSync('dist/main0.js', main)
  }

  const [mainDecoder_, ...mainFormatted_] = main.split(', ! function')
  const mainDecoder = mainDecoder_.trim()
  const mainFormatted = mainFormatted_.join(', ! function').trim().slice(0, -2) + ';'

  outputFileSync('dist/decode.js', `${mainDecoder})\n\n${file('src/decode.js')}`)
  outputFileSync('dist/main.js', `! function${mainFormatted}`)

  const decoderFunction = file('dist/decode.js').match(/^function (.+?)\(/)[1]

  spawnSync('node', ['dist/decode.js', decoderFunction])

  if (!debug) {
    removeSync('dist/decode.js')
  }

  const version = (await get('https://kcwiki.github.io/cache/gadget_html5/js/kcs_const.js')).data.match(/scriptVesion\s*?=\s*?["'](.+?)["']/)[1]
  outputFileSync('dist/version', version)

  const mainPatched = file('dist/main.js')
    .replace(/require\('window'\)/g, 'window')
    .replace(/require\('axios'\)/g, 'axios')
    .replace(/Object\.defineProperty\((\S+?), '__esModule'/g, "defineModule($1); Object.defineProperty($1, '__esModule'")
    .replace(/module\.exports = (\S+?)\((.+?)\)/, 'module.exports = registerModules($1($2))')

  outputFileSync('dist/main.js', `${file('src/patch.js').replace('version', version)}\n${mainPatched}`)
  outputFileSync('dist/api', inspect(require('../dist/main'), { maxArrayLength: 10000, depth: 10 }))
})()
