import { hasNormalizedSlot, normalizeSlot } from '@/utils/normalize-slot'
import { concat } from '@/utils/array'

// @vue/component
export const normalizeSlotMixin = {
  methods: {
    hasNormalizedSlot(name = 'default') {
      // Returns true if the either a $scopedSlot or $slot exists with the specified name
      // `name` can be a string name or an array of names
      return hasNormalizedSlot(name, this.$scopedSlots, this.$slots)
    },
    normalizeSlot(name = 'default', scope = {}) {
      // Returns an array of rendered VNodes if slot found.
      // Returns undefined if not found.
      // `name` can be a string name or an array of names
      const vNodes = normalizeSlot(name, scope, this.$scopedSlots, this.$slots)
      return vNodes ? concat(vNodes) : vNodes
    },
  },
}
