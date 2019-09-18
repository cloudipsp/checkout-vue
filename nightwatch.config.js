const chromedriver = require('chromedriver')

module.exports = {
  custom_commands_path: ['tests/e2e/custom-command'],
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
