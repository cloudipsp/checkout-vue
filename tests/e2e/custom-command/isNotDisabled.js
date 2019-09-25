exports.command = function(selector) {
  this.getAttribute(selector, 'disabled', function(result) {
    this.assert.equal(
      result.value,
      null,
      `Element <${selector}> is not disabled`
    )
  })
}
