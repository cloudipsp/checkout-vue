const {
  $root,
  $card_number,
  $expiry_dat,
  $cvv2,
  $submit,
  $3ds,
  $3ds_submit,
  $status_approved,
} = require('../config/selector')

module.exports = (options, { card_number, expiry_date, cvv2 }) => browser => {
  browser
    .url(`${process.env.VUE_DEV_SERVER_URL}/e2e.html`)
    .execute(
      function(options) {
        window.fondy('#app', options)
      },
      [options]
    )
    .waitForElementVisible($root, 5000)
    .setValue($card_number, card_number)
    .setValue($expiry_dat, expiry_date)
    .setValue($cvv2, cvv2)
    .click($submit)
    .waitForElementVisible($3ds, 5000)
    .frame(1)
    .click($3ds_submit)
    .waitForElementVisible($status_approved, 5000)
    .end()
}
