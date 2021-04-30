import { htmlOrText } from '@/utils/html'
import {
  formOptionsMixin,
  props as formOptionsProps,
} from '@/mixins/form-options'
import { normalizeSlotMixin } from '@/mixins/normalize-slot'
import { FFormSelectOption } from '@/components/form/item/helpers/form-select-option'

export const props = {
  ...formOptionsProps,
  label: {
    type: String,
    required: true,
  },
}

// @vue/component
export const FFormSelectOptionGroup = {
  mixins: [normalizeSlotMixin, formOptionsMixin],
  props,
  render(h) {
    const $options = this.formOptions.map((option, index) => {
      const { value, text, html, disabled } = option

      return h(FFormSelectOption, {
        attrs: { value, disabled },
        domProps: htmlOrText(html, text),
        key: `option_${index}`,
      })
    })

    return h('optgroup', { attrs: { label: this.label } }, [
      this.normalizeSlot('first'),
      $options,
      this.normalizeSlot(),
    ])
  },
}
