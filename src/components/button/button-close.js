import { mergeData } from 'vue-functional-data-merge'
import { stopEvent } from '@/utils/events'
import { isEvent } from '@/utils/inspect'
import { hasNormalizedSlot, normalizeSlot } from '@/utils/normalize-slot'

export const FButtonClose = {
  functional: true,
  props: {
    content: {
      type: String,
      default: '&times;',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    ariaLabel: {
      type: String,
      default: 'Close',
    },
  },
  render(h, { props, data, slots, scopedSlots }) {
    const $slots = slots()
    const $scopedSlots = scopedSlots || {}

    const componentData = {
      staticClass: 'f-close',
      attrs: {
        type: 'button',
        'aria-label': props.ariaLabel ? String(props.ariaLabel) : null,
      },
      on: {
        click(evt) {
          // Ensure click on button HTML content is also disabled
          if (props.disabled && isEvent(evt)) {
            stopEvent(evt)
          }
        },
      },
    }

    if (!hasNormalizedSlot('default', $scopedSlots, $slots)) {
      componentData.domProps = { innerHTML: props.content }
    }
    return h(
      'button',
      mergeData(data, componentData),
      normalizeSlot('default', {}, $scopedSlots, $slots)
    )
  },
}
