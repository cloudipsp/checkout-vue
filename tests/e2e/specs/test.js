// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': browser => {
    browser
      .url(`${process.env.VUE_DEV_SERVER_URL}/e2e.html`)
      .execute(function() {
        window.fondy('#app', {
          options: {
            api_domain: 'api.dev.fondy.eu',
          },
          params: {
            merchant_id: 901325,
            currency: 'UAH',
            amount: 200,
          },
        })
      })
      .waitForElementVisible('#f', 5000)

      .assert.elementPresent('.f-wrapper')
      .verify.containsText('[for="f-card_number"]', 'Card number')
      .assert.elementCount('img', 2)

      .setValue('#f-card_number', '4444555566661111')
      .setValue('#f-expiry_date', '11/20')
      .setValue('#f-cvv2', ['111',browser.Keys.ENTER])
      // .click('.f-pay-button [type="button"]')
      .waitForElementVisible('.ipsp-modal-iframe', 10000)
      .frame(1)
      .click('[type="submit"]')
      .pause(10000)
      .end()
  },
  // 'snippet tests': browser => {
  //   browser
  //     .url(`${process.env.VUE_DEV_SERVER_URL}/e2e_snippet.html`)
  //     .execute(function() {
  //       window.fondy('#app', {
  //         options: {
  //           api_domain: 'api.dev.fondy.eu',
  //         },
  //         params: {
  //           amount: 500,
  //         },
  //       })
  //     })
  //     .waitForElementVisible('#f', 50000)
  //     // .pause(50000)
  //     .assert.elementPresent('.f-wrapper')
  //     .verify.containsText('[for="f-card_number"]', 'Card number')
  //     .assert.elementCount('img', 2)
  //     .end()
  // },
}
