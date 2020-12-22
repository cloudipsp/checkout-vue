import Vue from 'vue'
import { BFormInput } from 'bootstrap-vue'

export default Vue.extend({
  extends: BFormInput,
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'input',
  },
  computed: {
    computedClass() {
      return []
    },
  },
  render(h) {
    return h('input', {
      ref: 'input',
      class: this.computedClass,
      attrs: { ...this.$attrs, ...this.computedAttrs },
      domProps: { value: this.localValue },
      on: this.computedListeners,
    })
  },
})
