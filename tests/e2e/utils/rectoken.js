const {
  $submit,
  $tr_root,
  $tr_rectoken,
  $cvv2,
  $is_ready,
  $card_number,
  $expiry_date,
  $tr_status,
} = require('../config/selector')

module.exports = (options, { card_number, expiry_date, cvv2 }) => browser => {
  browser
    .testpage(options)
    .initCheckout(options)
    .setCard(card_number, expiry_date, cvv2)
    .click($submit)
    .waitForElementVisible($tr_root)
    .getText($tr_rectoken, result => {
      options.params.rectoken = result.value
      delete options.params.token
    })
    .testpage(options)
    .initCheckout(options)
    .waitForElementPresent($is_ready)
    .isDisabled($card_number)
    .isDisabled($expiry_date)
    .setValue($cvv2, cvv2)
    .click($submit)
    .waitForElementVisible($tr_root)
    .assert.containsText($tr_status, 'approved')
    .end()
}
