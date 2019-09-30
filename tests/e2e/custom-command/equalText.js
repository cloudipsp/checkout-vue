exports.command = function(selector, text) {
  this.getText(selector, function(result) {
    this.assert.equal(
      result.value,
      text,
      `Element <${selector}> has text "${text}"`
    )
  })
}
