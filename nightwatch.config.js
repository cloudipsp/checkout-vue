const chromedriver = require('chromedriver')

module.exports = {
  selenium: {
    cli_args: {
      'webdriver.chrome.driver': chromedriver.path,
    },
  },
  test_settings: {
    chrome: {
      desiredCapabilities: {
        chromeOptions: {
          args: [
            // 'start-fullscreen'
          ],
        },
      },
    },
  },
}
