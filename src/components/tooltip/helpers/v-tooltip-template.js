import Vue from 'vue'
import { BVTooltipTemplate } from 'bootstrap-vue/esm/components/tooltip/helpers/bv-tooltip-template'
import { isFunction, isUndefinedOrNull } from 'bootstrap-vue/esm/utils/inspect'
import Transition from '@/utils/transition'
import Popper from 'popper.js'
import { isElement } from '@/utils/dom'

export default Vue.extend({
  extends: BVTooltipTemplate,
  computed: {
    templateClasses() {
      return [
        {
          // Disables pointer events to hide the tooltip when the user
          // hovers over its content
          noninteractive: !this.interactive,
          [`f-${this.templateType}-${this.variant}`]: this.variant,
          // `attachment` will come from BVToolpop
          [`f-${this.templateType}-${this.attachment}`]: this.attachment,
        },
        this.customClass,
      ]
    },
    popperConfig() {
      const placement = this.placement
      return {
        positionFixed: true,
        placement: this.getAttachment(placement),
        modifiers: {
          offset: { offset: this.getOffset(placement) },
          flip: { behavior: this.fallbackPlacement },
          // `arrow.element` can also be a reference to an HTML Element
          // maybe we should make this a `$ref` in the templates?
          arrow: { element: this.$refs.arrow },
          preventOverflow: {
            padding: this.boundaryPadding,
            boundariesElement: this.boundary,
          },
        },
        onCreate: data => {
          this.updatePopper()
          // Handle flipping arrow classes
          if (data.originalPlacement !== data.placement) {
            /* istanbul ignore next: can't test in JSDOM */
            this.popperPlacementChange(data)
          }
        },
        onUpdate: data => {
          // Handle flipping arrow classes
          this.popperPlacementChange(data)
        },
      }
    },
  },
  methods: {
    popperCreate(el) {
      this.destroyPopper()
      // We use `el` rather than `this.$el` just in case the original
      // mountpoint root element type was changed by the template
      let target = isElement(this.target.reference)
        ? this.target.reference
        : this.target
      this.$_popper = new Popper(target, el, this.popperConfig)
    },
    renderTemplate(h) {
      // Title can be a scoped slot function
      const $title = isFunction(this.title)
        ? this.title({})
        : isUndefinedOrNull(this.title)
        ? /* istanbul ignore next */ h()
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
  render(h) {
    // Note: `f-show` and 'f-fade' classes are only appled during transition
    return h(
      Transition,
      {
        // Transitions as soon as mounted
        props: { appear: true, noFade: this.noFade },
        on: {
          // Events used by parent component/instance
          beforeEnter: el => this.$emit('show', el),
          afterEnter: el => this.$emit('shown', el),
          beforeLeave: el => this.$emit('hide', el),
          afterLeave: el => this.$emit('hidden', el),
        },
      },
      [this.localShow ? this.renderTemplate(h) : h()]
    )
  },
})
