import { isBoolean } from '@/utils/inspect'

export const props = {
  state: {
    // Tri-state prop: true, false, null (or undefined)
    type: Boolean,
    default: null,
  },
}

// @vue/component
export const formStateMixin = {
  props,
  computed: {
    computedState() {
      // If not a boolean, ensure that value is null
      return isBoolean(this.state) ? this.state : null
    },
  },
}
