const { readFileSync, outputFileSync } = require('fs-extra')

const debug = process.env.DEBUG
const decoderFunction = process.argv[2]
const passes = +process.argv[3] || 5

let main = readFileSync('dist/main.js').toString()

// decoding with eval

for (let pass = 1; pass <= passes; ++pass) {
  const decoderFunctions = [...main.matchAll(new RegExp(`var ([_a-zA-Z][_a-zA-Z0-9]*?) = ${decoderFunction}[;,]`, 'g'))].map(e => e[1])
  main = main
    .replace(new RegExp(`(?:${decoderFunctions.join('|')})\\((.+?)\\)`, 'g'), x =>
      `'${eval(decoderFunction + '(' + x.split('(')[1])}'`.replace(/\n/g, '\\n'),
    )
    .replace(new RegExp(`var (${decoderFunctions.join('|')}) = ${decoderFunction}([;,])`, 'g'), 'var $1 = null$2')
  if (pass < passes) {
    main = main.replace(new RegExp(`var ([_a-zA-Z][_a-zA-Z0-9]*?) = (?:${decoderFunctions.join('|')})([;,])`, 'g'), `var $1 = ${decoderFunction}$2`)
  }
  if (debug) {
    outputFileSync(`debug/main${pass}.js`, main)
  }
}

// cosmetics

const vars = {}
let i = 0

outputFileSync(
  'dist/main.js',
  main
    .replace(/([_a-zA-Z][_a-zA-Z0-9]*?)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/\[\('([_a-zA-Z][_a-zA-Z0-9]*?)'\)\]/g, "['$1']")
    .replace(/_(0x[a-f0-9]{4,6})/g, (_, x) => `_${(vars[x] || (vars[x] = ++i)).toString(36)}`)
    .replace(/(0x[a-f0-9]+?)\.toString()/g, (_, x) => `(${+x}).toString()`)
    .replace(/(0x[a-f0-9]+)/g, (_, x) => `${+x}`)
    .replace(/\)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, ').$1')
    .replace(/\]\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '].$1')
    .replace(/([_a-zA-Z][_a-zA-Z0-9]*?)\['\$_\$'\]\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1[$_$].$2')
    .replace(/([_a-zA-Z][_a-zA-Z0-9]*?)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/\\u([\d\w]{4})/gi, (_, e) => String.fromCharCode(parseInt(e, 16)))
    .replace("`'symbol'`", '`symbol`'),
)
