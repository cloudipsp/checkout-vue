const install = (Vue) => {
  Vue.mixin({
    beforeCreate(){
      const options = this.$options
      // store injection
      if (options.store) {
        this.store = options.store
      } else if (options.parent && options.parent.store) {
        this.store = options.parent.store
      }

      if(!this.store) return
      // alias
      this.state = this.store.state
      this.options = this.store.state.options
      this.regular = this.store.state.regular
      this.params = this.store.state.params
      this.error = this.store.state.error
      this.router = this.store.state.router
      this.$css = this.store.state.css
    },
    data () {
      return {
        store: this.store, // store make reactive
      }
    },
  })
}

export default { install }
