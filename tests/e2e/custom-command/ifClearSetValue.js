exports.command = function(selector, value) {
  if (value === undefined) {
    return this
  } else {
    return this.clearValue(selector).setValue(selector, value)
  }
}
