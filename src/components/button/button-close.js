import { mergeData } from 'vue-functional-data-merge'
import { stopEvent } from '@/utils/events'
import { isEvent } from '@/utils/inspect'
import { hasNormalizedSlot, normalizeSlot } from '@/utils/normalize-slot'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export const FButtonClose = {
  functional: true,
  props: {
    content: makeProp(PROP_TYPE_STRING, '&times;'),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    ariaLabel: makeProp(PROP_TYPE_STRING, 'Close'),
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
