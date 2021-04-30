import { mergeData } from 'vue-functional-data-merge'

export const props = {
  value: {
    // type: [String, Number, Boolean, Object],
    required: true,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
}

// @vue/component
export const FFormSelectOption = {
  functional: true,
  props,
  render(h, { props, data, children }) {
    const { value, disabled } = props
    return h(
      'option',
      mergeData(data, {
        attrs: { disabled },
        domProps: { value },
      }),
      children
    )
  },
}
