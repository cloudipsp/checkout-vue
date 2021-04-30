import { attemptBlur, attemptFocus } from '@/utils/dom'
import { eventOn, eventOff, eventOnOff, stopEvent } from '@/utils/events'
import {
  formControlMixin,
  props as formControlProps,
} from '@/mixins/form-control'
import { formStateMixin, props as formStateProps } from '@/mixins/form-state'
import { idMixin, props as idProps } from '@/mixins/id'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { toString } from '@/utils/string'

// @vue/component
export const FFormInput = {
  // Mixin order is important!
  mixins: [
    attrsMixin,
    listenersMixin,
    idMixin,
    formControlMixin,
    formStateMixin,
  ],
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    ...idProps,
    ...formControlProps,
    ...formStateProps,
    value: {
      type: [String, Number],
      default: '',
    },
    ariaInvalid: {
      type: [Boolean, String],
      default: false,
    },
    // `value` prop is defined in form-text mixin
    type: {
      type: String,
      default: 'text',
    },
    noWheel: {
      // Disable mousewheel to prevent wheel from
      // changing values (i.e. number/date)
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      localValue: toString(this.value),
      vModelValue: this.value,
    }
  },
  computed: {
    computedAriaInvalid() {
      if (!this.ariaInvalid || this.ariaInvalid === 'false') {
        // `this.ariaInvalid` is `null` or `false` or 'false'
        return this.computedState === false ? 'true' : null
      }
      if (this.ariaInvalid === true) {
        // User wants explicit `:aria-invalid="true"`
        return 'true'
      }
      // Most likely a string value (which could be the string 'true')
      return this.ariaInvalid
    },
    computedAttrs() {
      const { type, disabled, required } = this

      return {
        ...this.fAttrs,
        id: this.safeId(),
        type,
        disabled,
        required,
        'aria-required': required ? 'true' : null,
        'aria-invalid': this.computedAriaInvalid,
      }
    },
    computedListeners() {
      return {
        ...this.fListeners,
        input: this.onInput,
        change: this.onChange,
        blur: this.onBlur,
      }
    },
  },
  watch: {
    noWheel(newVal) {
      this.setWheelStopper(newVal)
    },
    value(newVal) {
      const stringifyValue = toString(newVal)
      if (stringifyValue !== this.localValue && newVal !== this.vModelValue) {
        // Update the local values
        this.localValue = stringifyValue
        this.vModelValue = newVal
      }
    },
  },
  mounted() {
    // Preset the internal state
    const value = this.value
    const stringifyValue = toString(value)

    if (stringifyValue !== this.localValue && value !== this.vModelValue) {
      this.localValue = stringifyValue
      this.vModelValue = value
    }

    this.setWheelStopper(this.noWheel)
  },
  deactivated() {
    // Turn off listeners when keep-alive component deactivated
    this.setWheelStopper(false)
  },
  activated() {
    // Turn on listeners (if no-wheel) when keep-alive component activated
    this.setWheelStopper(this.noWheel)
  },
  beforeDestroy() {
    this.setWheelStopper(false)
  },
  methods: {
    updateValue(value) {
      this.localValue = value
      if (value !== this.vModelValue) {
        this.vModelValue = value
        this.$emit('update', value)
      }
    },
    onInput(evt) {
      // `evt.target.composing` is set by Vue
      // https://github.com/vuejs/vue/blob/dev/src/platforms/web/runtime/directives/model.js
      // TODO: Is this needed now with the latest Vue?
      /* istanbul ignore if: hard to test composition events */
      if (evt.target.composing) {
        return
      }
      // Exit when prevented the input event
      if (evt.defaultPrevented) {
        stopEvent(evt, { propagation: false })
        return
      }
      const value = evt.target.value
      this.updateValue(value)
      this.$emit('input', value)
    },
    onChange(evt) {
      // Exit when prevented the input event
      if (evt.defaultPrevented) {
        stopEvent(evt, { propagation: false })
        return
      }
      const value = evt.target.value
      this.updateValue(value)
      this.$emit('change', value)
    },
    onBlur(evt) {
      // Apply the `localValue` on blur to prevent cursor jumps
      // on mobile browsers (e.g. caused by autocomplete)
      const value = evt.target.value
      this.updateValue(value)

      // Emit native blur event
      this.$emit('blur', evt)
    },
    focus() {
      // For external handler that may want a focus method
      if (!this.disabled) {
        attemptFocus(this.$el)
      }
    },
    blur() {
      // For external handler that may want a blur method
      if (!this.disabled) {
        attemptBlur(this.$el)
      }
    },
    setWheelStopper(on) {
      const input = this.$el
      // We use native events, so that we don't interfere with propagation
      eventOnOff(on, input, 'focus', this.onWheelFocus)
      eventOnOff(on, input, 'blur', this.onWheelBlur)
      if (!on) {
        eventOff(document, 'wheel', this.stopWheel)
      }
    },
    onWheelFocus() {
      eventOn(document, 'wheel', this.stopWheel)
    },
    onWheelBlur() {
      eventOff(document, 'wheel', this.stopWheel)
    },
    stopWheel(evt) {
      stopEvent(evt, { propagation: false })
      attemptBlur(this.$el)
    },
  },
  render(h) {
    return h('input', {
      ref: 'input',
      attrs: this.computedAttrs,
      domProps: { value: this.localValue },
      on: this.computedListeners,
    })
  },
}
