const { $card_number, $expiry_date, $cvv2 } = require('../config/selector')

exports.command = function(card_number, expiry_date, cvv2) {
  return this
    .clearSetValue($card_number, card_number)
    .clearSetValue($expiry_date, expiry_date)
    .clearSetValue($cvv2, cvv2)
}
