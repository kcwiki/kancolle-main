const test = require('tape')

const main = require('.')

test('SuffixUtil', t => {
  t.equal(main.fn('SuffixUtil').create(156, 'ship_card'), '6982')
  t.end()
})
