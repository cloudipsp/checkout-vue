let result = {
  '@tags': [],
}
let tests = 'declined_3ds'

require(`../data/${tests}`).forEach((i, k) => {
  result[`${tests}_${k}`] = require(`../utils/${tests}`)(i[0], i[1])
})

module.exports = result
