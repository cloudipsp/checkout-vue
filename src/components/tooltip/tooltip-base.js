import { getScopeId } from '@/utils/get-scope-id'
import { isUndefinedOrNull } from '@/utils/inspect'
import { HTMLElement, SVGElement } from '@/utils/safe-types'
import { Tooltip } from '@/components/tooltip/helpers/tooltip'
import {
  PROP_TYPE_ARRAY_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_FUNCTION,
  PROP_TYPE_NUMBER_OBJECT_STRING,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_OBJECT,
  PROP_TYPE_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'

// @vue/component
export default {
  inheritAttrs: false,
  props: {
    // String: scrollParent, window, or viewport
    // Element: element reference
    // Object: Vue component
    boundary: makeProp(
      [HTMLElement, PROP_TYPE_OBJECT, PROP_TYPE_STRING],
      'scrollParent'
    ),
    boundaryPadding: makeProp(PROP_TYPE_NUMBER_STRING, 5),
    customClass: makeProp(PROP_TYPE_STRING),
    delay: makeProp(PROP_TYPE_NUMBER_OBJECT_STRING, 50),
    disabled: makeProp(PROP_TYPE_BOOLEAN, false),
    fallbackPlacement: makeProp(PROP_TYPE_ARRAY_STRING, 'flip'),
    // ID to use for tooltip element
    // If not provided on will automatically be generated
    id: makeProp(PROP_TYPE_STRING),
    noFade: makeProp(PROP_TYPE_BOOLEAN, false),
    noninteractive: makeProp(PROP_TYPE_BOOLEAN, false),
    offset: makeProp(PROP_TYPE_NUMBER_STRING, 0),
    placement: makeProp(PROP_TYPE_STRING, 'top'),
    // String ID of element, or element/component reference
    // Or function that returns one of the above
    target: makeProp(
      [
        HTMLElement,
        SVGElement,
        PROP_TYPE_FUNCTION,
        PROP_TYPE_OBJECT,
        PROP_TYPE_STRING,
      ],
      undefined,
      true
    ),
    title: makeProp(PROP_TYPE_STRING),
    triggers: makeProp(PROP_TYPE_ARRAY_STRING, 'hover focus'),
    variant: makeProp(PROP_TYPE_STRING),
    show: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      localShow: this.show,
      localTitle: '',
      localContent: '',
    }
  },
  computed: {
    templateData() {
      // Data that will be passed to the template and popper
      return {
        // We use massaged versions of the title and content props/slots
        title: this.localTitle,
        content: this.localContent,
        // Pass these props as is
        target: this.target,
        triggers: this.triggers,
        placement: this.placement,
        fallbackPlacement: this.fallbackPlacement,
        variant: this.variant,
        customClass: this.customClass,
        container: this.$root,
        boundary: this.boundary,
        boundaryPadding: this.boundaryPadding,
        delay: this.delay,
        offset: this.offset,
        noFade: this.noFade,
        interactive: !this.noninteractive,
        disabled: this.disabled,
        id: this.id,
      }
    },
    templateTitleContent() {
      // Used to watch for changes to the title and content props
      return {
        title: this.title,
        content: this.content,
      }
    },
  },
  watch: {
    show(show, oldVal) {
      if (show !== oldVal && show !== this.localShow && this.$_toolpop) {
        if (show) {
          this.$_toolpop.show()
        } else {
          // We use `forceHide()` to override any active triggers
          this.$_toolpop.forceHide()
        }
      }
    },
    disabled(newVal) {
      if (newVal) {
        this.doDisable()
      } else {
        this.doEnable()
      }
    },
    localShow(newVal) {
      // TODO: May need to be done in a `$nextTick()`
      this.$emit('update:show', newVal)
    },
    templateData() {
      this.$nextTick(() => {
        if (this.$_toolpop) {
          this.$_toolpop.updateData(this.templateData)
        }
      })
    },
    // Watchers for title/content props (prop changes do not trigger the `updated()` hook)
    templateTitleContent() {
      this.$nextTick(this.updateContent)
    },
  },
  created() {
    // Create private non-reactive props
    this.$_toolpop = null
  },
  updated() {
    // Update the `propData` object
    // Done in a `$nextTick()` to ensure slot(s) have updated
    this.$nextTick(this.updateContent)
  },
  beforeDestroy() {
    // Shutdown our local event listeners
    this.$off('open', this.doOpen)
    this.$off('close', this.doClose)
    this.$off('disable', this.doDisable)
    this.$off('enable', this.doEnable)
    // Destroy the tip instance
    if (this.$_toolpop) {
      this.$_toolpop.$destroy()
      this.$_toolpop = null
    }
  },
  mounted() {
    // Instantiate a new Tooltip instance
    // Done in a `$nextTick()` to ensure DOM has completed rendering
    // so that target can be found
    this.$nextTick(() => {
      // Load the on demand child instance
      const Component = this.getComponent()
      // Ensure we have initial content
      this.updateContent()
      // Pass down the scoped style attribute if available
      const scopeId = getScopeId(this) || getScopeId(this.$parent)
      // Create the instance
      const $toolpop = (this.$_toolpop = new Component({
        parent: this,
        // Pass down the scoped style ID
        _scopeId: scopeId || undefined,
      }))
      // Set the initial data
      $toolpop.updateData(this.templateData)
      // Set listeners
      $toolpop.$on('show', this.onShow)
      $toolpop.$on('shown', this.onShown)
      $toolpop.$on('hide', this.onHide)
      $toolpop.$on('hidden', this.onHidden)
      $toolpop.$on('disabled', this.onDisabled)
      $toolpop.$on('enabled', this.onEnabled)
      // Initially disabled?
      if (this.disabled) {
        // Initially disabled
        this.doDisable()
      }
      // Listen to open signals from others
      this.$on('open', this.doOpen)
      // Listen to close signals from others
      this.$on('close', this.doClose)
      // Listen to disable signals from others
      this.$on('disable', this.doDisable)
      // Listen to enable signals from others
      this.$on('enable', this.doEnable)
      // Initially show tooltip?
      if (this.localShow) {
        $toolpop.show()
      }
    })
  },
  methods: {
    getComponent() {
      // Overridden by BPopover
      return Tooltip
    },
    updateContent() {
      // Overridden by BPopover
      // Tooltip: Default slot is `title`
      // Popover: Default slot is `content`, `title` slot is title
      // We pass a scoped slot function reference by default (Vue v2.6x)
      // And pass the title prop as a fallback
      this.setTitle(this.$scopedSlots.default || this.title)
    },
    // Helper methods for `updateContent()`
    setTitle(val) {
      val = isUndefinedOrNull(val) ? '' : val
      // We only update the value if it has changed
      if (this.localTitle !== val) {
        this.localTitle = val
      }
    },
    setContent(val) {
      val = isUndefinedOrNull(val) ? '' : val
      // We only update the value if it has changed
      if (this.localContent !== val) {
        this.localContent = val
      }
    },
    // --- Template event handlers ---
    onShow(fEvt) {
      // Placeholder
      this.$emit('show', fEvt)
      if (fEvt) {
        this.localShow = !fEvt.defaultPrevented
      }
    },
    onShown(fEvt) {
      // Tip is now showing
      this.localShow = true
      this.$emit('shown', fEvt)
    },
    onHide(fEvt) {
      this.$emit('hide', fEvt)
    },
    onHidden(fEvt) {
      // Tip is no longer showing
      this.$emit('hidden', fEvt)
      this.localShow = false
    },
    onDisabled(fEvt) {
      // Prevent possible endless loop if user mistakenly
      // fires `disabled` instead of `disable`
      if (fEvt && fEvt.type === 'disabled') {
        this.$emit('update:disabled', true)
        this.$emit('disabled', fEvt)
      }
    },
    onEnabled(fEvt) {
      // Prevent possible endless loop if user mistakenly
      // fires `enabled` instead of `enable`
      if (fEvt && fEvt.type === 'enabled') {
        this.$emit('update:disabled', false)
        this.$emit('enabled', fEvt)
      }
    },
    // --- Local event listeners ---
    doOpen() {
      !this.localShow && this.$_toolpop && this.$_toolpop.show()
    },
    doClose() {
      this.localShow && this.$_toolpop && this.$_toolpop.hide()
    },
    doDisable() {
      this.$_toolpop && this.$_toolpop.disable()
    },
    doEnable() {
      this.$_toolpop && this.$_toolpop.enable()
    },
  },
  render(h) {
    // Always renders a comment node
    // TODO:
    //   Future: Possibly render a target slot (single root element)
    //   which we can apply the listeners to (pass `this.$el` to Tooltip)
    return h()
  },
}
