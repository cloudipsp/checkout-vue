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
})
