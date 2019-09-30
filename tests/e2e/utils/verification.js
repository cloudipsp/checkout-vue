const {
  $submit,
  $code,
  $card_number,
  $status_approved,
} = require('../config/selector')

module.exports = (options, { card_number, expiry_date, cvv2 }) => browser => {
  browser
    .testpage(options)
    .initCheckout(options)
    .isNotDisabled($card_number)
    .setCard(card_number, expiry_date, cvv2)
    .click($submit)
    .waitForElementVisible($code, 5000)
    .isDisabled($card_number)
    .setValue($code, 'EURT')
    .click($submit)
    .waitForElementVisible($status_approved, 5000)
    .end()
}
