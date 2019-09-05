module.exports = (params, { card_number, expiry_date, cvv2 }) => browser => {
  browser
    .url(`${process.env.VUE_DEV_SERVER_URL}/e2e.html`)
    .execute(
      function(params) {
        window.fondy('#app', {
          options: {
            api_domain: 'api.dev.fondy.eu',
          },
          params,
        })
      },
      [params]
    )
    .waitForElementVisible('#f', 5000)
    .setValue('#f-card_number', card_number)
    .setValue('#f-expiry_date', expiry_date)
    .setValue('#f-cvv2', [cvv2, browser.Keys.ENTER])
    // .click('.f-pay-button [type="button"]')
    .waitForElementVisible('.ipsp-modal-iframe', 10000)
    .frame(1)
    .click('[type="submit"]')
    // .pause(10000)
    .end()
}
