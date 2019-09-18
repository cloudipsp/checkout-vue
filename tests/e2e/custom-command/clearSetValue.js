exports.command = function(selector, value) {
  return this.clearValue(selector).setValue(selector, value)
}
