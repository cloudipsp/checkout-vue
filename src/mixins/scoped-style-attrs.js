import { getScopeId } from '@/utils/get-scope-id'

// @vue/component
export const scopedStyleAttrsMixin = {
  computed: {
    scopedStyleAttrs() {
      const scopeId = getScopeId(this.$parent)
      return scopeId ? { [scopeId]: '' } : {}
    },
  },
}
