const { $submit, $3ds, $3ds_submit, $error } = require('../config/selector')

module.exports = (options, { card_number, expiry_date, cvv2 }) => browser => {
  browser
    .initCheckout(options)
    .setCard(card_number, expiry_date, cvv2)
    .click($submit)
    .waitForElementVisible($3ds, 5000)
    .frame(1)
    .click($3ds_submit)
    .waitForElementVisible($error, 5000)
    .end()
}
