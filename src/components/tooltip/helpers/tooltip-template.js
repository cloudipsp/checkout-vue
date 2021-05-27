import Vue from 'vue'
import { scopedStyleAttrsMixin } from '@/mixins/scoped-style-attrs'
import { isFunction, isUndefinedOrNull } from '@/utils/inspect'
import { Popper } from '@/components/tooltip/helpers/popper'

// @vue/component
export const TooltipTemplate = Vue.extend({
  extends: Popper,
  mixins: [scopedStyleAttrsMixin],
  props: {
    // Other non-reactive (while open) props are pulled in from Popper
    id: {
      type: String,
      // default: null
    },
    html: {
      // Used only by the directive versions
      type: Boolean,
      // default: false
    },
  },
  data() {
    // We use data, rather than props to ensure reactivity
    // Parent component will directly set this data
    return {
      title: '',
      content: '',
      variant: null,
      customClass: null,
      interactive: true,
    }
  },
  computed: {
    templateType() {
      return 'tooltip'
    },
    templateClasses() {
      return [
        {
          // Disables pointer events to hide the tooltip when the user
          // hovers over its content
          noninteractive: !this.interactive,
          [`f-${this.templateType}-${this.variant}`]: this.variant,
          // `attachment` will come from Toolpop
          [`f-${this.templateType}-${this.attachment}`]: this.attachment,
        },
        this.customClass,
      ]
    },
    templateAttributes() {
      return {
        // Apply attributes from root tooltip component
        ...this.$parent.$parent.$attrs,

        id: this.id,
        role: 'tooltip',
        tabindex: '-1',

        // Add the scoped style data attribute to the template root element
        ...this.scopedStyleAttrs,
      }
    },
    templateListeners() {
      // Used for hover/focus trigger listeners
      return {
        mouseenter: evt => {
          this.$emit('mouseenter', evt)
        },
        mouseleave: evt => {
          this.$emit('mouseleave', evt)
        },
        focusin: evt => {
          this.$emit('focusin', evt)
        },
        focusout: evt => {
          this.$emit('focusout', evt)
        },
      }
    },
  },
  methods: {
    renderTemplate(h) {
      // Title can be a scoped slot function
      const $title = isFunction(this.title)
        ? this.title({})
        : isUndefinedOrNull(this.title)
        ? h()
        : this.title

      // Directive versions only
      const domProps =
        this.html && !isFunction(this.title) ? { innerHTML: this.title } : {}

      return h(
        'div',
        {
          staticClass: 'f-tooltip',
          class: this.templateClasses,
          attrs: this.templateAttributes,
          on: this.templateListeners,
        },
        [
          h('div', { ref: 'arrow', staticClass: 'f-tooltip-arrow' }),
          h('div', { staticClass: 'f-tooltip-inner', domProps }, [$title]),
        ]
      )
    },
  },
})
