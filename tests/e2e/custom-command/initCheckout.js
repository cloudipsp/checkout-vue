exports.command = function(options) {
  return this.execute(
    function(options) {
      window.fondy('#app', options)
    },
    [options]
  )
}
