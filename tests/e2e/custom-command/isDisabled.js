// .assert.attributeEquals($card_number, 'disabled', 'true')
// .perform(() => browser.expect.element($card_number).to.have.attribute('disabled').which.contains(true))

exports.command = function(selector) {
  return this.getAttribute(selector, 'disabled', function(result) {
    this.assert.equal(result.value, 'true', `Element <${selector}> is disabled`)
  })
}
