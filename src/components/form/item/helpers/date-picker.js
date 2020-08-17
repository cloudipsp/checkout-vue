import Vue from 'vue'
import DatePicker from 'vue2-datepicker'
import mask from '@/utils/masker'

export default Vue.extend({
  extends: DatePicker,
  inheritAttrs: false,
  watch: {
    userInput(newValue) {
      let value = mask(newValue, '##/##/####', true)
      if (newValue !== value) {
        this.userInput = value || null
      }
    },
    // currentValue(newValue) {
    //   if (this.disabledDate(newValue)) {
    //     this.$emit('input', '')
    //   }
    // },
  },
})
