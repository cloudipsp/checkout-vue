import bus from '@/bus'

export default {
  created () {
    bus.$on('validate', this.onValidate)
    this.$watch(() => this.errors.items, (value) => {
      bus.$emit('errors-changed', value, this.$options.name, this.model)
    })
  },
  methods: {
    onValidate () {
      this.$validator.validateAll()
    }
  },
  beforeDestroy () {
    bus.$off('validate', this.onValidate)
  }
}
