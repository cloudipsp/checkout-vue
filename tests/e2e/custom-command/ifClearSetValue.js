exports.command = function(selector, value) {
  if (value === undefined) {
    return this.perform(() => {})
  } else {
    return this.clearValue(selector).setValue(selector, value)
  }
}
