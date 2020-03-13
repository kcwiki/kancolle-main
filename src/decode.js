const { readFileSync, writeFileSync } = require('fs')

const vars = {}
let i = 0

const decoderFunction = process.argv[2]

writeFileSync(
  'dist/main.js',
  readFileSync('dist/main.js')
    .toString()
    .replace(new RegExp(`${decoderFunction}\\('(.+?)'\\)`, 'g'), x => `'${eval(x)}'`.replace(/\n/g, '\\n'))
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/(\S)\['([_a-zA-Z][_a-zA-Z0-9]*?)'\]/g, '$1.$2')
    .replace(/\[\('([_a-zA-Z][_a-zA-Z0-9]*?)'\)\]/g, "['$1']")
    .replace(/_(0x[a-f0-9]{4,6})/g, (_, x) => `_${(vars[x] || (vars[x] = ++i)).toString(36)}`)
    .replace(/(0x[a-f0-9]+?)\.toString()/g, (_, x) => `(${+x}).toString()`)
    .replace(/(0x[a-f0-9]+)/g, (_, x) => `${+x}`),
)
