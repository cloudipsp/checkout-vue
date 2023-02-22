// Base on-demand component for tooltip / popover templates
//
// Currently:
//   Responsible for positioning and transitioning the template
//   Templates are only instantiated when shown, and destroyed when hidden
//

import PopperJs from 'popper.js'
import Vue from 'vue'
import { Transition } from '@/utils/transition'
import { getCS, isElement, requestAF, select } from '@/utils/dom'
import { toFloat } from '@/utils/number'
import { HTMLElement, SVGElement } from '@/utils/safe-types'
import {
  PROP_TYPE_ARRAY_STRING,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

const AttachmentMap = {
  AUTO: 'auto',
  TOP: 'top',
  RIGHT: 'right',
  BOTTOM: 'bottom',
  LEFT: 'left',
  TOPLEFT: 'top',
  TOPRIGHT: 'top',
  RIGHTTOP: 'right',
  RIGHTBOTTOM: 'right',
  BOTTOMLEFT: 'bottom-start',
  BOTTOMRIGHT: 'bottom-end',
  LEFTTOP: 'left',
  LEFTBOTTOM: 'left',
}

const OffsetMap = {
  AUTO: 0,
  TOPLEFT: -1,
  TOP: 0,
  TOPRIGHT: +1,
  RIGHTTOP: -1,
  RIGHT: 0,
  RIGHTBOTTOM: +1,
  BOTTOMLEFT: 0,
  BOTTOM: 0,
  BOTTOMRIGHT: 0,
  LEFTTOP: -1,
  LEFT: 0,
  LEFTBOTTOM: +1,
}

// @vue/component
export const Popper = Vue.extend({
  props: {
    // The minimum distance (in `px`) from the edge of the
    // tooltip/popover that the arrow can be positioned
    arrowPadding: makeProp(PROP_TYPE_NUMBER_STRING, 6),
    // 'scrollParent', 'viewport', 'window', or `Element`
    boundary: makeProp([HTMLElement, PROP_TYPE_STRING], 'scrollParent'),
    // Tooltip/popover will try and stay away from
    // boundary edge by this many pixels
    boundaryPadding: makeProp(PROP_TYPE_NUMBER_STRING, 5),
    fallbackPlacement: makeProp(PROP_TYPE_ARRAY_STRING, 'flip'),
    offset: makeProp(PROP_TYPE_NUMBER_STRING, 0),
    placement: makeProp(PROP_TYPE_STRING, 'top'),
    // Element that the tooltip/popover is positioned relative to
    target: makeProp([HTMLElement, SVGElement]),
  },
  data() {
    return {
      // reactive props set by parent
      noFade: false,
      // State related data
      localShow: true,
      attachment: this.getAttachment(this.placement),
    }
  },
  computed: {
    templateType() {
      // Overridden by template component
      return 'unknown'
    },
    popperConfig() {
      const { placement } = this
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
  created() {
    // Note: We are created on-demand, and should be guaranteed that
    // DOM is rendered/ready by the time the created hook runs
    this.$_popper = null
    // Ensure we show as we mount
    this.localShow = true
    // Create popper instance before shown
    this.$on('show', el => {
      this.popperCreate(el)
    })
    // Self destruct handler
    const handleDestroy = () => {
      this.$nextTick(() => {
        // In a `requestAF()` to release control back to application
        requestAF(() => {
          this.$destroy()
        })
      })
    }
    // Self destruct if parent destroyed
    this.$parent.$once('hook:destroyed', handleDestroy)
    // Self destruct after hidden
    this.$once('hidden', handleDestroy)
  },
  beforeMount() {
    // Ensure that the attachment position is correct before mounting
    // as our propsData is added after `new Template({...})`
    this.attachment = this.getAttachment(this.placement)
  },
  updated() {
    // Update popper if needed
    // TODO: Should this be a watcher on `this.popperConfig` instead?
    this.updatePopper()
  },
  beforeDestroy() {
    this.destroyPopper()
  },
  destroyed() {
    // Make sure template is removed from DOM
    const el = this.$el
    el && el.parentNode && el.parentNode.removeChild(el)
  },
  methods: {
    // "Public" method to trigger hide template
    hide() {
      this.localShow = false
    },
    // Private
    getAttachment(placement) {
      return AttachmentMap[String(placement).toUpperCase()] || 'auto'
    },
    getOffset(placement) {
      if (!this.offset) {
        // Could set a ref for the arrow element
        const arrow = this.$refs.arrow || select('.arrow', this.$el)
        const arrowOffset =
          toFloat(getCS(arrow).width, 0) + toFloat(this.arrowPadding, 0)
        switch (OffsetMap[String(placement).toUpperCase()] || 0) {
          case +1:
            return `+50%p - ${arrowOffset}px`
          case -1:
            return `-50%p + ${arrowOffset}px`
          default:
            return 0
        }
      }
      return this.offset
    },
    popperCreate(el) {
      this.destroyPopper()
      // We use `el` rather than `this.$el` just in case the original
      // mountpoint root element type was changed by the template
      let target = isElement(this.target?.reference)
        ? this.target.reference
        : this.target
      this.$_popper = new PopperJs(target, el, this.popperConfig)
    },
    destroyPopper() {
      this.$_popper && this.$_popper.destroy()
      this.$_popper = null
    },
    updatePopper() {
      this.$_popper && this.$_popper.scheduleUpdate()
    },
    popperPlacementChange(data) {
      // Callback used by popper to adjust the arrow placement
      this.attachment = this.getAttachment(data.placement)
    },
    renderTemplate(h) {
      // Will be overridden by templates
      return h('div')
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
