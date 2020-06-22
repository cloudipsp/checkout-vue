import Vue from 'vue'
import { BButtonClose } from 'bootstrap-vue'
import { mergeData } from 'vue-functional-data-merge'
import { isEvent } from 'bootstrap-vue/src/utils/inspect'
import {
  hasNormalizedSlot,
  normalizeSlot,
} from 'bootstrap-vue/src/utils/normalize-slot'

export default Vue.extend({
  extends: BButtonClose,
  render(h, { props, data, slots, scopedSlots }) {
    const $slots = slots()
    const $scopedSlots = scopedSlots || {}

    const componentData = {
      staticClass: 'f-close',
      class: {
        [`text-${props.textVariant}`]: props.textVariant,
      },
      attrs: {
        type: 'button',
        disabled: props.disabled,
        'aria-label': props.ariaLabel ? String(props.ariaLabel) : null,
      },
      on: {
        click(evt) {
          // Ensure click on button HTML content is also disabled
          /* istanbul ignore if: bug in JSDOM still emits click on inner element */
          if (props.disabled && isEvent(evt)) {
            evt.stopPropagation()
            evt.preventDefault()
          }
        },
      },
    }
    // Careful not to override the default slot with innerHTML
    if (!hasNormalizedSlot('default', $scopedSlots, $slots)) {
      componentData.domProps = { innerHTML: props.content }
    }
    return h(
      'button',
      mergeData(data, componentData),
      normalizeSlot('default', {}, $scopedSlots, $slots)
    )
  },
})
