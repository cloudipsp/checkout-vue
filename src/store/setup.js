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
    },
  })
}

export default { install }
