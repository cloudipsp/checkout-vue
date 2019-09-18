let fs = require('fs')
let path = require('path')
let handlebars = require('handlebars')

module.exports = {
  write: function(results, options, done) {
    let reportFilename =
      options.filename_prefix + Math.floor(Date.now() / 1000) + '.html'
    let reportFilePath = path.join(options.output_folder, reportFilename)
    // read the html template
    fs.readFile('./tests/e2e/reporter/html-reporter.hbs', function(err, data) {
      if (err) throw err

      let template = data.toString()

      // merge the template with the test results data
      let html = handlebars.compile(template)({
        results: results,
        options: options,
        timestamp: new Date().toString(),
        browser: options.filename_prefix.split('_').join(' '),
      })

      // write the html to a file
      fs.writeFile(reportFilePath, html, function(err) {
        if (err) throw err
        console.log('Report generated: ' + reportFilePath)
        done()
      })
    })
  },
}
