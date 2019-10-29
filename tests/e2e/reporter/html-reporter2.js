let HtmlReporter = require('nightwatch-html-reporter')

let reporter = new HtmlReporter({
  openBrowser: true,
  reportsDirectory: __dirname,
})

module.exports = {
  write: function(results, options, done) {
    reporter.fn(results, done)
  },
}
