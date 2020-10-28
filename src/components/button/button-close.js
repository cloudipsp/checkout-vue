import { BButtonClose } from 'bootstrap-vue'
import Vue, { mergeData } from 'bootstrap-vue/esm/vue'
import { SLOT_NAME_DEFAULT } from 'bootstrap-vue/esm/constants/slot-names'
import { stopEvent } from 'bootstrap-vue/esm/utils/events'
import { isEvent } from 'bootstrap-vue/esm/utils/inspect'
import {
  hasNormalizedSlot,
  normalizeSlot,
} from 'bootstrap-vue/esm/utils/normalize-slot'

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
            stopEvent(evt)
          }
        },
      },
    }
    // Careful not to override the default slot with innerHTML
    if (!hasNormalizedSlot(SLOT_NAME_DEFAULT, $scopedSlots, $slots)) {
      componentData.domProps = { innerHTML: props.content }
    }
    return h(
      'button',
      mergeData(data, componentData),
      normalizeSlot(SLOT_NAME_DEFAULT, {}, $scopedSlots, $slots)
    )
  },
})
