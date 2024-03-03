const { spawnSync } = require('child_process')
const { inspect } = require('util')
const { sortBy } = require('lodash')
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

const debug = process.env.DEBUG
const passes = process.argv[2] || 5

const getParts = main => {
  main = '\n' + main.trim()

  const mainSep1 = '\n(function'
  const mainSep2 = ', ! function'
  const functionSep = '\nfunction'

  const ix = []
  for (let i = -1; ; ) {
    const i1 = main.indexOf(mainSep1, i + 1)
    const i2 = main.indexOf(functionSep, i + 1)
    if (i1 === -1 && i2 === -1) break
    i = i1 === -1 ? i2 : i2 === -1 ? i1 : Math.min(i1, i2)
    ix.push(i)
  }

  const parts = []
  for (let n = 1; n <= ix.length; ++n) {
    parts.push(main.slice(ix[n - 1], n === ix.length ? undefined : ix[n]))
  }

  const mainPart = parts.find(part => part.startsWith(mainSep1)).trim()
  const functionParts = sortBy(
    parts.filter(part => part.startsWith(functionSep)).map(part => part.trim()),
    part => part.length,
  )

  const [mainDecoder_, ...mainFormatted_] = mainPart.split(mainSep2).map(part => part.trim())
  const mainDecoder = [...functionParts, mainDecoder_].join('\n\n') + ')'
  const mainFormatted = `! function${mainFormatted_.join(mainSep2).slice(0, -2)};`
  const decoderFunction = functionParts[0].match(/^function (.+?)\(/)[1]

  return { mainDecoder, mainFormatted, decoderFunction }
}

!(async () => {
  const main =
    debug && existsSync('debug/main0.js')
      ? readFileSync('debug/main0.js').toString()
      : beautify((await get('http://203.104.209.71/kcs2/js/main.js')).data, { indent_size: 2 })

  const { mainDecoder, mainFormatted, decoderFunction } = getParts(main)

  const decoder = `${mainDecoder}\n\n${file('src/decode.js')}`

  outputFileSync('dist/decode.js', decoder)
  outputFileSync('dist/main.js', mainFormatted)

  if (debug) {
    outputFileSync('debug/decode.js', decoder)
    outputFileSync('debug/main0.js', main)
  }

  spawnSync('node', ['dist/decode.js', decoderFunction, passes])

  removeSync('dist/decode.js')

  const version = (await get('https://kcwiki.github.io/cache/gadget_html5/js/kcs_const.js')).data.match(/scriptVesion\s*?=\s*?["'](.+?)["']/)[1]
  outputFileSync('dist/version', version)

  const mainPatched = file('dist/main.js')
    .replace(/require\('window'\)/g, 'window')
    .replace(/require\('axios'\)/g, 'axios')
    .replace(/Object\.defineProperty\((\S+?), '__esModule'/g, "defineModule($1); Object.defineProperty($1, '__esModule'")
    .replace(/module\.exports = (\S+?)\((.+?)\)/, 'module.exports = registerModules($1($2))')

  outputFileSync('dist/main.js', `${file('src/patch.js').replace('version', version)}\n${mainPatched}`)
  outputFileSync(
    'dist/api',
    inspect(require('../dist/main'), { maxArrayLength: 10000, depth: 10 })
      .replace('<ref *1> ', '')
      .replace('  default: [Circular *1],\n', '')
      .replace(/\[Function \(anonymous\)\]/g, '[Function]')
      .replace(/\[Function: [_a-zA-Z][_a-zA-Z0-9]*?\]/g, '[Function]'),
  )
})()
