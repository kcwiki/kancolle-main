const { inspect } = require('util')
const { writeFileSync } = require('fs-extra')

const main = require('.')

writeFileSync(`${__dirname}/dist/api`, inspect(main.modules, { maxArrayLength: 10000, depth: 10 }))
