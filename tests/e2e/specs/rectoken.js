let result = {
  '@tags': [''],
}

let tests = 'rectoken'

require(`../data/${tests}`).forEach((i, k) => {
  result[`${tests}_${k}`] = require(`../utils/${tests}`)(i[0], i[1])
})

module.exports = result
