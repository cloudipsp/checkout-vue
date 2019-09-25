// .assert.attributeEquals($card_number, 'disabled', 'true')

exports.command = function(selector) {
  this.getAttribute(selector, 'disabled', function(result) {
    this.assert.equal(result.value, 'true', `Element <${selector}> is disabled`)
  })
}
