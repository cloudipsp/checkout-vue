// Tooltip "Class" (Built as a renderless Vue instance)
//
// Handles trigger events, etc.
// Instantiates template on demand

import Vue from 'vue'
import { EVENT_OPTIONS_NO_CAPTURE } from '@/constants/events'
import { getScopeId } from '@/utils/get-scope-id'
import { looseEqual } from '@/utils/loose-equal'
import { mathMax } from '@/utils/math'
import { noop } from '@/utils/noop'
import { arrayIncludes, concat, from as arrayFrom } from '@/utils/array'
import {
  attemptFocus,
  closest,
  contains,
  getAttr,
  getById,
  hasAttr,
  hasClass,
  isDisabled,
  isElement,
  isVisible,
  removeAttr,
  requestAF,
  select,
  setAttr,
} from '@/utils/dom'
import { eventOn, eventOff, eventOnOff } from '@/utils/events'
import {
  isFunction,
  isNumber,
  isPlainObject,
  isString,
  isUndefined,
  isUndefinedOrNull,
} from '@/utils/inspect'
import { toInteger } from '@/utils/number'
import { keys } from '@/utils/object'
import { FEvent } from '@/utils/event.class'
import { TooltipTemplate } from '@/import'
import { CODE_DOWN, CODE_ENTER, CODE_SPACE } from '@/constants/key-codes'

// Modal container selector for appending tooltip/popover
const MODAL_SELECTOR = '.f-modal-content'
// Modal `$root` hidden event
const MODAL_CLOSE_EVENT = 'bv::modal::hidden'

// For dropdown sniffing
const DROPDOWN_CLASS = 'dropdown'
const DROPDOWN_OPEN_SELECTOR = '.dropdown-menu.show'

// Data attribute to temporary store the `title` attribute's value
const DATA_TITLE_ATTR = 'data-original-title'

// Data specific to popper and template
// We don't use props, as we need reactivity (we can't pass reactive props)
const templateData = {
  // Text string or Scoped slot function
  title: '',
  // Text string or Scoped slot function
  content: '',
  // String
  variant: null,
  // String, Array, Object
  customClass: null,
  // String or array of Strings (overwritten by Popper)
  triggers: '',
  // String (overwritten by Popper)
  placement: 'auto',
  // String or array of strings
  fallbackPlacement: 'flip',
  // Element or Component reference (or function that returns element) of
  // the element that will have the trigger events bound, and is also
  // default element for positioning
  target: null,
  // HTML ID, Element or Component reference
  container: null, // 'body'
  // Boolean
  noFade: false,
  // 'scrollParent', 'viewport', 'window', Element, or Component reference
  boundary: 'scrollParent',
  // Tooltip/popover will try and stay away from
  // boundary edge by this many pixels (Number)
  boundaryPadding: 5,
  // Arrow offset (Number)
  offset: 0,
  // Hover/focus delay (Number or Object)
  delay: 0,
  // Arrow of Tooltip/popover will try and stay away from
  // the edge of tooltip/popover edge by this many pixels
  arrowPadding: 6,
  // Interactive state (Boolean)
  interactive: true,
  // Disabled state (Boolean)
  disabled: false,
  // ID to use for tooltip/popover
  id: null,
  // Flag used by directives only, for HTML content
  html: false,
}

// @vue/component
export const Tooltip = Vue.extend({
  data() {
    return {
      // BTooltip/BPopover/VBTooltip/VBPopover will update this data
      // Via the exposed updateData() method on this instance
      // Popover will override some of these defaults
      ...templateData,
      // State management data
      activeTrigger: {
        // manual: false,
        hover: false,
        click: false,
        focus: false,
      },
      localShow: false,
    }
  },
  computed: {
    templateType() {
      // Overwritten by Popover
      return 'tooltip'
    },
    computedId() {
      return this.id || `__f_${this.templateType}_${this._uid}__`
    },
    computedDelay() {
      // Normalizes delay into object form
      const delay = { show: 0, hide: 0 }
      if (isPlainObject(this.delay)) {
        delay.show = mathMax(toInteger(this.delay.show, 0), 0)
        delay.hide = mathMax(toInteger(this.delay.hide, 0), 0)
      } else if (isNumber(this.delay) || isString(this.delay)) {
        delay.show = delay.hide = mathMax(toInteger(this.delay, 0), 0)
      }
      return delay
    },
    computedTriggers() {
      // Returns the triggers in sorted array form
      // TODO: Switch this to object form for easier lookup
      return concat(this.triggers)
        .filter(Boolean)
        .join(' ')
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .sort()
    },
    isWithActiveTrigger() {
      for (const trigger in this.activeTrigger) {
        if (this.activeTrigger[trigger]) {
          return true
        }
      }
      return false
    },
    computedTemplateData() {
      return {
        title: this.title,
        content: this.content,
        variant: this.variant,
        customClass: this.customClass,
        noFade: this.noFade,
        interactive: this.interactive,
      }
    },
  },
  watch: {
    computedTriggers(newTriggers, oldTriggers) {
      // Triggers have changed, so re-register them
      if (!looseEqual(newTriggers, oldTriggers)) {
        this.$nextTick(() => {
          // Disable trigger listeners
          this.unListen()
          // Clear any active triggers that are no longer in the list of triggers
          oldTriggers.forEach(trigger => {
            if (!arrayIncludes(newTriggers, trigger)) {
              if (this.activeTrigger[trigger]) {
                this.activeTrigger[trigger] = false
              }
            }
          })
          // Re-enable the trigger listeners
          this.listen()
        })
      }
    },
    computedTemplateData() {
      // If any of the while open reactive "props" change,
      // ensure that the template updates accordingly
      this.handleTemplateUpdate()
    },
    title(newValue, oldValue) {
      // Make sure to hide the tooltip when the title is set empty
      if (newValue !== oldValue && !newValue) {
        this.hide()
      }
    },
    disabled(newValue) {
      if (newValue) {
        this.disable()
      } else {
        this.enable()
      }
    },
  },
  created() {
    // Create non-reactive properties
    this.$_tip = null
    this.$_hoverTimeout = null
    this.$_hoverState = ''
    this.$_visibleInterval = null
    this.$_enabled = !this.disabled
    this.$_noop = noop.bind(this)

    // Destroy ourselves when the parent is destroyed
    if (this.$parent) {
      this.$parent.$once('hook:beforeDestroy', () => {
        this.$nextTick(() => {
          // In a `requestAF()` to release control back to application
          requestAF(() => {
            this.$destroy()
          })
        })
      })
    }

    this.$nextTick(() => {
      const target = this.getTarget()
      if (target && contains(document.body, target)) {
        // Copy the parent's scoped style attribute
        this.scopeId = getScopeId(this.$parent)
        // Set up all trigger handlers and listeners
        this.listen()
      }
    })
  },
  updated() {
    // Usually called when the slots/data changes
    this.$nextTick(this.handleTemplateUpdate)
  },
  deactivated() {
    // In a keepalive that has been deactivated, so hide
    // the tooltip/popover if it is showing
    this.forceHide()
  },
  beforeDestroy() {
    // Remove all handler/listeners
    this.unListen()
    this.setWhileOpenListeners(false)
    // Clear any timeouts/intervals
    this.clearHoverTimeout()
    this.clearVisibilityInterval()
    // Destroy the template
    this.destroyTemplate()
    // Remove any other private properties created during create
    this.$_noop = null
  },
  methods: {
    // --- Methods for creating and destroying the template ---
    updateData(data = {}) {
      // Method for updating popper/template data
      // We only update data if it exists, and has not changed
      let titleUpdated = false
      keys(templateData).forEach(prop => {
        if (!isUndefined(data[prop]) && this[prop] !== data[prop]) {
          this[prop] = data[prop]
          if (prop === 'title') {
            titleUpdated = true
          }
        }
      })
      // If the title has updated, we may need to handle the `title`
      // attribute on the trigger target
      // We only do this while the template is open
      if (titleUpdated && this.localShow) {
        this.fixTitle()
      }
    },
    createTemplateAndShow() {
      // Creates the template instance and show it
      const container = this.getContainer()

      TooltipTemplate().then(({ TooltipTemplate }) => {
        const $tip = (this.$_tip = new TooltipTemplate({
          parent: this,
          // The following is not reactive to changes in the props data
          propsData: {
            // These values cannot be changed while template is showing
            id: this.computedId,
            html: this.html,
            placement: this.placement,
            fallbackPlacement: this.fallbackPlacement,
            target: this.getPlacementTarget(),
            boundary: this.getBoundary(),
            // Ensure the following are integers
            offset: toInteger(this.offset, 0),
            arrowPadding: toInteger(this.arrowPadding, 0),
            boundaryPadding: toInteger(this.boundaryPadding, 0),
          },
        }))
        // We set the initial reactive data (values that can be changed while open)
        this.handleTemplateUpdate()
        // Template transition phase events (handled once only)
        // When the template has mounted, but not visibly shown yet
        $tip.$once('show', this.onTemplateShow)
        // When the template has completed showing
        $tip.$once('shown', this.onTemplateShown)
        // When the template has started to hide
        $tip.$once('hide', this.onTemplateHide)
        // When the template has completed hiding
        $tip.$once('hidden', this.onTemplateHidden)
        // When the template gets destroyed for any reason
        $tip.$once('hook:destroyed', this.destroyTemplate)
        // Convenience events from template
        // To save us from manually adding/removing DOM
        // listeners to tip element when it is open
        $tip.$on('focusin', this.handleEvent)
        $tip.$on('focusout', this.handleEvent)
        $tip.$on('mouseenter', this.handleEvent)
        $tip.$on('mouseleave', this.handleEvent)
        // Mount (which triggers the `show`)
        $tip.$mount(container.appendChild(document.createElement('div')))
        // Template will automatically remove its markup from DOM when hidden
      })
    },
    hideTemplate() {
      // Trigger the template to start hiding
      // The template will emit the `hide` event after this and
      // then emit the `hidden` event once it is fully hidden
      // The `hook:destroyed` will also be called (safety measure)
      this.$_tip && this.$_tip.hide()
      // Clear out any stragging active triggers
      this.clearActiveTriggers()
      // Reset the hover state
      this.$_hoverState = ''
    },
    // Destroy the template instance and reset state
    destroyTemplate() {
      this.setWhileOpenListeners(false)
      this.clearHoverTimeout()
      this.$_hoverState = ''
      this.clearActiveTriggers()
      this.localPlacementTarget = null
      try {
        this.$_tip.$destroy()
        // eslint-disable-next-line no-empty
      } catch {}
      this.$_tip = null
      this.removeAriaDescribedby()
      this.restoreTitle()
      this.localShow = false
    },
    getTemplateElement() {
      return this.$_tip ? this.$_tip.$el : null
    },
    handleTemplateUpdate() {
      // Update our template title/content "props"
      // So that the template updates accordingly
      const $tip = this.$_tip
      if ($tip) {
        const props = [
          'title',
          'content',
          'variant',
          'customClass',
          'noFade',
          'interactive',
        ]
        // Only update the values if they have changed
        props.forEach(prop => {
          if ($tip[prop] !== this[prop]) {
            $tip[prop] = this[prop]
          }
        })
      }
    },
    // --- Show/Hide handlers ---
    // Show the tooltip
    show() {
      const target = this.getTarget()
      if (
        !target ||
        !contains(document.body, target) ||
        !isVisible(target) ||
        this.dropdownOpen() ||
        ((isUndefinedOrNull(this.title) || this.title === '') &&
          (isUndefinedOrNull(this.content) || this.content === ''))
      ) {
        // If trigger element isn't in the DOM or is not visible, or
        // is on an open dropdown toggle, or has no content, then
        // we exit without showing
        return
      }
      // If tip already exists, exit early
      if (this.$_tip || this.localShow) {
        return
      }
      // In the process of showing
      this.localShow = true
      // Create a cancelable FEvent
      const showEvt = this.buildEvent('show', { cancelable: true })
      this.emitEvent(showEvt)
      // Don't show if event cancelled
      /* istanbul ignore if */
      if (showEvt.defaultPrevented) {
        // Destroy the template (if for some reason it was created)
        this.destroyTemplate()
        return
      }
      // Fix the title attribute on target
      this.fixTitle()
      // Set aria-describedby on target
      this.addAriaDescribedby()
      // Create and show the tooltip
      this.createTemplateAndShow()
    },
    hide(force = false) {
      // Hide the tooltip
      const tip = this.getTemplateElement()
      /* istanbul ignore if */
      if (!tip || !this.localShow) {
        this.restoreTitle()
        return
      }

      // Emit cancelable FEvent 'hide'
      // We disable cancelling if `force` is true
      const hideEvt = this.buildEvent('hide', { cancelable: !force })
      this.emitEvent(hideEvt)
      /* istanbul ignore if: ignore for now */
      if (hideEvt.defaultPrevented) {
        // Don't hide if event cancelled
        return
      }

      // Tell the template to hide
      this.hideTemplate()
    },
    forceHide() {
      // Forcefully hides/destroys the template, regardless of any active triggers
      const tip = this.getTemplateElement()
      if (!tip || !this.localShow) {
        return
      }
      // Disable while open listeners/watchers
      // This is also done in the template `hide` evt handler
      this.setWhileOpenListeners(false)
      // Clear any hover enter/leave event
      this.clearHoverTimeout()
      this.$_hoverState = ''
      this.clearActiveTriggers()
      // Disable the fade animation on the template
      if (this.$_tip) {
        this.$_tip.noFade = true
      }
      // Hide the tip (with force = true)
      this.hide(true)
    },
    enable() {
      this.$_enabled = true
      // Create a non-cancelable FEvent
      this.emitEvent(this.buildEvent('enabled'))
    },
    disable() {
      this.$_enabled = false
      // Create a non-cancelable FEvent
      this.emitEvent(this.buildEvent('disabled'))
    },
    // --- Handlers for template events ---
    // When template is inserted into DOM, but not yet shown
    onTemplateShow() {
      // Enable while open listeners/watchers
      this.setWhileOpenListeners(true)
    },
    // When template show transition completes
    onTemplateShown() {
      const prevHoverState = this.$_hoverState
      this.$_hoverState = ''
      if (prevHoverState === 'out') {
        this.leave(null)
      }
      // Emit a non-cancelable FEvent 'shown'
      this.emitEvent(this.buildEvent('shown'))
    },
    // When template is starting to hide
    onTemplateHide() {
      // Disable while open listeners/watchers
      this.setWhileOpenListeners(false)
    },
    // When template has completed closing (just before it self destructs)
    onTemplateHidden() {
      // Destroy the template
      this.destroyTemplate()
      // Emit a non-cancelable FEvent 'shown'
      this.emitEvent(this.buildEvent('hidden'))
    },
    // --- Utility methods ---
    getTarget() {
      let { target } = this
      if (isString(target)) {
        target = getById(target.replace(/^#/, ''))
      } else if (isFunction(target)) {
        target = target()
      } else if (target) {
        target = target.$el || target
      }
      return isElement(target) ? target : null
    },
    getPlacementTarget() {
      // This is the target that the tooltip will be placed on, which may not
      // necessarily be the same element that has the trigger event listeners
      // For now, this is the same as target
      // TODO:
      //   Add in child selector support
      //   Add in visibility checks for this element
      //   Fallback to target if not found
      return this.getTarget()
    },
    getTargetId() {
      // Returns the ID of the trigger element
      const target = this.getTarget()
      return target && target.id ? target.id : null
    },
    getContainer() {
      return this.container
        ? this.container.$el || this.container
        : document.body
    },
    getBoundary() {
      return this.boundary ? this.boundary.$el || this.boundary : 'scrollParent'
    },
    isInModal() {
      const target = this.getTarget()
      return target && closest(MODAL_SELECTOR, target)
    },
    isDropdown() {
      // Returns true if trigger is a dropdown
      const target = this.getTarget()
      return target && hasClass(target, DROPDOWN_CLASS)
    },
    dropdownOpen() {
      // Returns true if trigger is a dropdown and the dropdown menu is open
      const target = this.getTarget()
      return (
        this.isDropdown() && target && select(DROPDOWN_OPEN_SELECTOR, target)
      )
    },
    clearHoverTimeout() {
      clearTimeout(this.$_hoverTimeout)
      this.$_hoverTimeout = null
    },
    clearVisibilityInterval() {
      clearInterval(this.$_visibleInterval)
      this.$_visibleInterval = null
    },
    clearActiveTriggers() {
      for (const trigger in this.activeTrigger) {
        this.activeTrigger[trigger] = false
      }
    },
    addAriaDescribedby() {
      // Add aria-describedby on trigger element, without removing any other IDs
      const target = this.getTarget()
      let desc = getAttr(target, 'aria-describedby') || ''
      desc = desc.split(/\s+/).concat(this.computedId).join(' ').trim()
      // Update/add aria-described by
      setAttr(target, 'aria-describedby', desc)
    },
    removeAriaDescribedby() {
      // Remove aria-describedby on trigger element, without removing any other IDs
      const target = this.getTarget()
      let desc = getAttr(target, 'aria-describedby') || ''
      desc = desc
        .split(/\s+/)
        .filter(d => d !== this.computedId)
        .join(' ')
        .trim()
      // Update or remove aria-describedby
      if (desc) {
        setAttr(target, 'aria-describedby', desc)
      } else {
        removeAttr(target, 'aria-describedby')
      }
    },
    fixTitle() {
      // If the target has a `title` attribute,
      // remove it and store it on a data attribute
      const target = this.getTarget()
      if (hasAttr(target, 'title')) {
        // Get `title` attribute value and remove it from target
        const title = getAttr(target, 'title')
        setAttr(target, 'title', '')
        // Only set the data attribute when the value is truthy
        if (title) {
          setAttr(target, DATA_TITLE_ATTR, title)
        }
      }
    },
    restoreTitle() {
      // If the target had a `title` attribute,
      // restore it and remove the data attribute
      const target = this.getTarget()
      if (hasAttr(target, DATA_TITLE_ATTR)) {
        // Get data attribute value and remove it from target
        const title = getAttr(target, DATA_TITLE_ATTR)
        removeAttr(target, DATA_TITLE_ATTR)
        // Only restore the `title` attribute when the value is truthy
        if (title) {
          setAttr(target, 'title', title)
        }
      }
    },
    // --- FEvent helpers ---
    buildEvent(type, options = {}) {
      // Defaults to a non-cancellable event
      return new FEvent(type, {
        cancelable: false,
        target: this.getTarget(),
        relatedTarget: this.getTemplateElement() || null,
        componentId: this.computedId,
        vueTarget: this,
        // Add in option overrides
        ...options,
      })
    },
    emitEvent(fEvt) {
      // Emits a FEvent on $root and this instance
      const evtName = fEvt.type
      const $root = this.$root
      if ($root && $root.$emit) {
        // Emit an event on $root
        $root.$emit(`bv::${this.templateType}::${evtName}`, fEvt)
      }
      this.$emit(evtName, fEvt)
    },
    // --- Event handler setup methods ---
    listen() {
      // Enable trigger event handlers
      const el = this.getTarget()
      if (!el) {
        return
      }
      // Listen for global show/hide events
      this.setRootListener(true)
      // Set up our listeners on the target trigger element
      this.computedTriggers.forEach(trigger => {
        if (trigger === 'click') {
          eventOn(el, 'click', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'clickout') {
          eventOn(
            document,
            'click',
            this.clickOutHandler,
            EVENT_OPTIONS_NO_CAPTURE
          )
        } else if (trigger === 'keydown') {
          eventOn(el, 'keydown', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'focus') {
          eventOn(el, 'focusin', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
          eventOn(el, 'focusout', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'blur') {
          // Used to close $tip when element looses focus
          eventOn(el, 'focusout', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        } else if (trigger === 'hover') {
          eventOn(el, 'mouseenter', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
          eventOn(el, 'mouseleave', this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
        }
      }, this)
    },
    unListen() {
      // Remove trigger event handlers
      const events = [
        'click',
        'keydown',
        'focusin',
        'focusout',
        'mouseenter',
        'mouseleave',
      ]
      const target = this.getTarget()

      // Stop listening for global show/hide/enable/disable events
      this.setRootListener(false)

      // Clear out any active target listeners
      events.forEach(evt => {
        target &&
          eventOff(target, evt, this.handleEvent, EVENT_OPTIONS_NO_CAPTURE)
      }, this)

      eventOff(
        document,
        'click',
        this.clickOutHandler,
        EVENT_OPTIONS_NO_CAPTURE
      )
    },
    clickOutHandler({ target }) {
      if (!this.localShow || contains(this.getTemplateElement(), target)) return

      this.hide()
    },
    setRootListener(on) {
      // Listen for global `bv::{hide|show}::{tooltip|popover}` hide request event
      const $root = this.$root
      if ($root) {
        const method = on ? '$on' : '$off'
        const type = this.templateType
        $root[method](`bv::hide::${type}`, this.doHide)
        $root[method](`bv::show::${type}`, this.doShow)
        $root[method](`bv::disable::${type}`, this.doDisable)
        $root[method](`bv::enable::${type}`, this.doEnable)
      }
    },
    setWhileOpenListeners(on) {
      // Events that are only registered when the template is showing
      // Modal close events
      this.setModalListener(on)
      // Dropdown open events (if we are attached to a dropdown)
      this.setDropdownListener(on)
      // Periodic $element visibility check
      // For handling when tip target is in <keepalive>, tabs, carousel, etc
      this.visibleCheck(on)
      // On-touch start listeners
      this.setOnTouchStartListener(on)
    },
    // Handler for periodic visibility check
    visibleCheck(on) {
      this.clearVisibilityInterval()
      const target = this.getTarget()
      const tip = this.getTemplateElement()
      if (on) {
        this.$_visibleInterval = setInterval(() => {
          if (
            tip &&
            this.localShow &&
            (!target.parentNode || !isVisible(target))
          ) {
            // Target element is no longer visible or not in DOM, so force-hide the tooltip
            this.forceHide()
          }
        }, 100)
      }
    },
    setModalListener(on) {
      // Handle case where tooltip/target is in a modal
      if (this.isInModal()) {
        // We can listen for modal hidden events on `$root`
        this.$root[on ? '$on' : '$off'](MODAL_CLOSE_EVENT, this.forceHide)
      }
    },
    setOnTouchStartListener(on) {
      // If this is a touch-enabled device we add extra empty
      // `mouseover` listeners to the body's immediate children
      // Only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html
      if ('ontouchstart' in document.documentElement) {
        arrayFrom(document.body.children).forEach(el => {
          eventOnOff(on, el, 'mouseover', this.$_noop)
        })
      }
    },
    setDropdownListener(on) {
      const target = this.getTarget()
      if (!target || !this.$root || !this.isDropdown) {
        return
      }
      // We can listen for dropdown shown events on its instance
      // TODO:
      //   We could grab the ID from the dropdown, and listen for
      //   $root events for that particular dropdown id
      //   Dropdown shown and hidden events will need to emit
      //   Note: Dropdown auto-ID happens in a `$nextTick()` after mount
      //         So the ID lookup would need to be done in a `$nextTick()`
      if (target.__vue__) {
        target.__vue__[on ? '$on' : '$off']('shown', this.forceHide)
      }
    },
    // --- Event handlers ---
    handleEvent(evt) {
      // General trigger event handler
      // target is the trigger element
      const target = this.getTarget()
      if (
        !target ||
        isDisabled(target) ||
        !this.$_enabled ||
        this.dropdownOpen()
      ) {
        // If disabled or not enabled, or if a dropdown that is open, don't do anything
        // If tip is shown before element gets disabled, then tip will not
        // close until no longer disabled or forcefully closed
        return
      }
      const { type, keyCode } = evt
      const triggers = this.computedTriggers

      if (type === 'click' && arrayIncludes(triggers, 'click')) {
        this.click(evt)
      } else if (type === 'keydown' && arrayIncludes(triggers, 'keydown')) {
        if ([CODE_ENTER, CODE_SPACE, CODE_DOWN].includes(keyCode)) {
          this.toggle()
        }
      } else if (type === 'mouseenter' && arrayIncludes(triggers, 'hover')) {
        // `mouseenter` is a non-bubbling event
        this.enter(evt)
      } else if (type === 'focusin' && arrayIncludes(triggers, 'focus')) {
        // `focusin` is a bubbling event
        // `evt` includes `relatedTarget` (element losing focus)
        this.enter(evt)
      } else if (
        (type === 'focusout' &&
          (arrayIncludes(triggers, 'focus') ||
            arrayIncludes(triggers, 'blur'))) ||
        (type === 'mouseleave' && arrayIncludes(triggers, 'hover'))
      ) {
        // `focusout` is a bubbling event
        // `mouseleave` is a non-bubbling event
        // `tip` is the template (will be null if not open)
        const tip = this.getTemplateElement()
        // `evtTarget` is the element which is losing focus/hover and
        const evtTarget = evt.target
        // `relatedTarget` is the element gaining focus/hover
        const relatedTarget = evt.relatedTarget
        if (
          // From tip to target
          (tip &&
            contains(tip, evtTarget) &&
            contains(target, relatedTarget)) ||
          // From target to tip
          (tip &&
            contains(target, evtTarget) &&
            contains(tip, relatedTarget)) ||
          // Within tip
          (tip && contains(tip, evtTarget) && contains(tip, relatedTarget)) ||
          // Within target
          (contains(target, evtTarget) && contains(target, relatedTarget))
        ) {
          // If focus/hover moves within `tip` and `target`, don't trigger a leave
          return
        }
        // Otherwise trigger a leave
        this.leave(evt)
      }
    },
    doHide(id) {
      // Programmatically hide tooltip or popover
      if (!id || this.getTargetId() === id || this.computedId === id) {
        // Close all tooltips or popovers, or this specific tip (with ID)
        this.forceHide()
      }
    },
    doShow(id) {
      // Programmatically show tooltip or popover
      if (!id || this.getTargetId() === id || this.computedId === id) {
        // Open all tooltips or popovers, or this specific tip (with ID)
        this.show()
      }
    },
    /*istanbul ignore next: ignore for now */
    doDisable(id) /*istanbul ignore next: ignore for now */ {
      // Programmatically disable tooltip or popover
      if (!id || this.getTargetId() === id || this.computedId === id) {
        // Disable all tooltips or popovers (no ID), or this specific tip (with ID)
        this.disable()
      }
    },
    /*istanbul ignore next: ignore for now */
    doEnable(id) /*istanbul ignore next: ignore for now */ {
      // Programmatically enable tooltip or popover
      if (!id || this.getTargetId() === id || this.computedId === id) {
        // Enable all tooltips or popovers (no ID), or this specific tip (with ID)
        this.enable()
      }
    },
    click(evt) {
      if (!this.$_enabled || this.dropdownOpen()) {
        return
      }
      // Get around a WebKit bug where `click` does not trigger focus events
      // On most browsers, `click` triggers a `focusin`/`focus` event first
      // Needed so that trigger 'click blur' works on iOS
      // https://github.com/bootstrap-vue/bootstrap-vue/issues/5099
      // We use `currentTarget` rather than `target` to trigger on the
      // element, not the inner content
      attemptFocus(evt.currentTarget)
      this.activeTrigger.click = !this.activeTrigger.click
      if (this.isWithActiveTrigger) {
        this.enter(null)
      } else {
        this.leave(null)
      }
    },
    toggle() {
      // Manual toggle handler
      if (!this.$_enabled || this.dropdownOpen()) {
        return
      }
      // Should we register as an active trigger?
      // this.activeTrigger.manual = !this.activeTrigger.manual
      if (this.localShow) {
        this.leave(null)
      } else {
        this.enter(null)
      }
    },
    enter(evt = null) {
      // Opening trigger handler
      // Note: Click events are sent with evt === null
      if (evt) {
        this.activeTrigger[evt.type === 'focusin' ? 'focus' : 'hover'] = true
      }
      if (this.localShow || this.$_hoverState === 'in') {
        this.$_hoverState = 'in'
        return
      }
      this.clearHoverTimeout()
      this.$_hoverState = 'in'
      if (!this.computedDelay.show) {
        this.show()
      } else {
        // Hide any title attribute while enter delay is active
        this.fixTitle()
        this.$_hoverTimeout = setTimeout(() => {
          /* istanbul ignore else */
          if (this.$_hoverState === 'in') {
            this.show()
          } else if (!this.localShow) {
            this.restoreTitle()
          }
        }, this.computedDelay.show)
      }
    },
    leave(evt = null) {
      // Closing trigger handler
      // Note: Click events are sent with evt === null
      if (evt) {
        this.activeTrigger[evt.type === 'focusout' ? 'focus' : 'hover'] = false
        if (
          evt.type === 'focusout' &&
          arrayIncludes(this.computedTriggers, 'blur')
        ) {
          // Special case for `blur`: we clear out the other triggers
          this.activeTrigger.click = false
          this.activeTrigger.hover = false
        }
      }
      if (this.isWithActiveTrigger) {
        return
      }
      this.clearHoverTimeout()
      this.$_hoverState = 'out'
      if (!this.computedDelay.hide) {
        this.hide()
      } else {
        this.$_hoverTimeout = setTimeout(() => {
          if (this.$_hoverState === 'out') {
            this.hide()
          }
        }, this.computedDelay.hide)
      }
    },
  },
})
