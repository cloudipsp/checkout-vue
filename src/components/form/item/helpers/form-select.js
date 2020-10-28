import Vue from 'vue'
import { SLOT_NAME_FIRST } from 'bootstrap-vue/esm/constants/slot-names'
import { htmlOrText } from 'bootstrap-vue/esm/utils/html'
import { BFormSelect } from 'bootstrap-vue'
import { BFormSelectOption } from 'bootstrap-vue/esm/components/form-select/form-select-option'
import { BFormSelectOptionGroup } from 'bootstrap-vue/esm/components/form-select/form-select-option-group'

export default Vue.extend({
  extends: BFormSelect,
  inheritAttrs: false,
  computed: {
    inputClass() {
      return []
    },
  },
  render(h) {
    const {
      name,
      disabled,
      required,
      computedSelectSize: size,
      localValue: value,
    } = this

    const $options = this.formOptions.map((option, index) => {
      const { value, label, options, disabled } = option
      const key = `option_${index}`

      return Array.isArray(options)
        ? h(BFormSelectOptionGroup, { props: { label, options }, key })
        : h(BFormSelectOption, {
            props: { value, disabled },
            domProps: htmlOrText(option.html, option.text),
            key,
          })
    })

    return h(
      'select',
      {
        class: this.inputClass,
        attrs: {
          ...this.$attrs,
          id: this.safeId(),
          name,
          form: this.form || null,
          multiple: this.multiple || null,
          size,
          disabled,
          required,
          'aria-required': required ? 'true' : null,
          'aria-invalid': this.computedAriaInvalid,
        },
        on: { change: this.onChange },
        directives: [{ name: 'model', value }],
        ref: 'input',
      },
      [this.normalizeSlot(SLOT_NAME_FIRST), $options, this.normalizeSlot()]
    )
  },
})
