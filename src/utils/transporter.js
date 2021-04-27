import { FTransporterTargetSingle } from '@/utils/transporter-target'
import { identity } from '@/utils/identity'
import { concat } from '@/utils/array'
import { select } from '@/utils/dom'
import { isBrowser } from '@/utils/env'
import { isString } from '@/utils/inspect'
import { HTMLElement } from '@/utils/safe-types'
import { normalizeSlotMixin } from '@/mixins/normalize-slot'

// This component has no root element, so only a single VNode is allowed
// @vue/component
export const FTransporterSingle = {
  mixins: [normalizeSlotMixin],
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    container: {
      // String: CSS selector,
      // HTMLElement: Element reference
      // Mainly needed for tooltips/popovers inside modals
      type: [String, HTMLElement],
      default: 'body',
    },
    tag: {
      // This should be set to match the root element type
      type: String,
      default: 'div',
    },
  },
  watch: {
    disabled: {
      immediate: true,
      handler(disabled) {
        disabled ? this.unmountTarget() : this.$nextTick(this.mountTarget)
      },
    },
  },
  created() {
    // Create private non-reactive props
    this.$_defaultFn = null
    this.$_target = null
  },
  beforeMount() {
    this.mountTarget()
  },
  updated() {
    // We need to make sure that all children have completed updating
    // before rendering in the target
    // `vue-simple-portal` has the this in a `$nextTick()`,
    // while `portal-vue` doesn't
    // Just trying to see if the `$nextTick()` delay is required or not
    // Since all slots in Vue 2.6.x are always functions
    this.updateTarget()
  },
  beforeDestroy() {
    this.unmountTarget()
    this.$_defaultFn = null
  },
  methods: {
    // Get the element which the target should be appended to
    getContainer() {
      if (isBrowser) {
        const container = this.container
        return isString(container) ? select(container) : container
      } else {
        return null
      }
    },
    // Mount the target
    mountTarget() {
      if (!this.$_target) {
        const container = this.getContainer()
        if (container) {
          const el = document.createElement('div')
          container.appendChild(el)
          this.$_target = new FTransporterTargetSingle({
            el,
            parent: this,
            propsData: {
              // Initial nodes to be rendered
              nodes: concat(this.normalizeSlot()),
            },
          })
        }
      }
    },
    // Update the content of the target
    updateTarget() {
      if (isBrowser && this.$_target) {
        const defaultFn = this.$scopedSlots.default
        if (!this.disabled) {
          if (defaultFn && this.$_defaultFn !== defaultFn) {
            // We only update the target component if the scoped slot
            // function is a fresh one. The new slot syntax (since Vue 2.6)
            // can cache unchanged slot functions and we want to respect that here
            this.$_target.updatedNodes = defaultFn
          } else if (!defaultFn) {
            // We also need to be back compatible with non-scoped default slot (i.e. 2.5.x)
            this.$_target.updatedNodes = this.$slots.default
          }
        }
        // Update the scoped slot function cache
        this.$_defaultFn = defaultFn
      }
    },
    // Unmount the target
    unmountTarget() {
      this.$_target && this.$_target.$destroy()
      this.$_target = null
    },
  },
  render(h) {
    if (this.disabled) {
      const nodes = concat(this.normalizeSlot()).filter(identity)
      if (nodes.length > 0 && !nodes[0].text) {
        return nodes[0]
      }
    }
    return h()
  },
}
