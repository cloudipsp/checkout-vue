const install = Vue => {
  // @vue/component
  Vue.mixin({
    data() {
      return {
        store: this.store, // store make reactive
      }
    },
    beforeCreate() {
      const options = this.$options
      // store injection
      if (options.store) {
        this.store = options.store
      } else if (options.parent && options.parent.store) {
        this.store = options.parent.store
      }

      if (!this.store) return
      // alias
      this.state = this.store.state
      this.options = this.store.state.options
      this.params = this.store.state.params
      this.router = this.store.state.router
      this.$css = this.store.state.css
    },
  })
}

export default { install }
