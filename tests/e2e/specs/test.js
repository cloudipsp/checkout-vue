const simple = require('../utils/simple')
const data = require('../data/simple')

let tests = {}

data.forEach((i, k) => {
  tests['simple' + k] = simple(i[0], i[1])
})

module.exports = tests
