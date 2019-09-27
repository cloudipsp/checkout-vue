let result = {
  '@tags': ['dev'],
}

let tests = 'verification'

require(`../data/${tests}`).forEach((i, k) => {
  result[`${tests}_${k}`] = require(`../utils/${tests}`)(i[0], i[1])
})

module.exports = result
