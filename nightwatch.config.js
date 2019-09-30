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
      globals: {
        waitForConditionTimeout: 5000,
      },
      screenshots: {
        enabled: true,
        on_failure: true,
        on_error: true,
        path: 'tests/e2e/reports/',
      },
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
