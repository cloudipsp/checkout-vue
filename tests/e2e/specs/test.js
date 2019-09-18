//browser.Keys.ENTER

let result = {}
let tests = ['approved_3ds', 'declined_3ds']

tests.forEach(name => {
  require(`../data/${name}`).forEach((i, k) => {
    result[`${name}_${k}`] = require(`../utils/${name}`)(i[0], i[1])
  })
})

module.exports = result
