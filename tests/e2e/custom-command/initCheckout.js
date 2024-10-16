const { $root } = require('../config/selector')

exports.command = function(options) {
  return this.url(`${process.env.VUE_DEV_SERVER_URL}/e2e.html`)
    .execute(
      function(options) {
        window.checkout('#app', options)
      },
      [options]
    )
    .waitForElementVisible($root)
}
