import { attemptBlur, attemptFocus } from '@/utils/dom'
import { eventOn, eventOff, eventOnOff, stopEvent } from '@/utils/events'
import {
  formControlMixin,
  props as formControlProps,
} from '@/mixins/form-control'
import { formStateMixin, props as formStateProps } from '@/mixins/form-state'
import { idMixin, idProps } from '@/mixins/id'
import { attrsMixin } from '@/mixins/attrs'
import { listenersMixin } from '@/mixins/listeners'
import { toString } from '@/utils/string'
import {
  PROP_TYPE_STRING,
  PROP_TYPE_BOOLEAN,
  PROP_TYPE_NUMBER_STRING,
  PROP_TYPE_BOOLEAN_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { mask } from '@/utils/mask'

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
    value: makeProp(PROP_TYPE_NUMBER_STRING, ''),
    ariaInvalid: makeProp(PROP_TYPE_BOOLEAN_STRING, false),
    // `value` prop is defined in form-text mixin
    type: makeProp(PROP_TYPE_STRING, 'text'),
    // Disable mousewheel to prevent wheel from changing values (i.e. number/date)
    noWheel: makeProp(PROP_TYPE_BOOLEAN, false),
    mask: makeProp(PROP_TYPE_STRING),
    masked: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  data() {
    return {
      localValue: this.formatLocal(this.value),
      vModelValue: this.parseModel(this.value),
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
      let localValue = this.formatLocal(newVal)
      let vModelValue = this.parseModel(newVal)

      if (localValue !== this.localValue && newVal !== this.vModelValue) {
        this.localValue = localValue
        this.vModelValue = vModelValue
      }
    },
  },
  mounted() {
    let localValue = this.formatLocal(this.value)
    let vModelValue = this.parseModel(this.value)

    if (localValue !== this.localValue && vModelValue !== this.vModelValue) {
      this.localValue = localValue
      this.vModelValue = vModelValue
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
      let $input = this.$refs.input
      let position = $input.selectionEnd
      let isLast =
        this.vModelValue &&
        value.length === position &&
        value.length > this.localValue.length

      let localValue = this.formatLocal(value, isLast)
      let vModelValue = this.parseModel(value)

      this.localValue = localValue
      if (vModelValue !== this.vModelValue) {
        this.vModelValue = vModelValue
        this.$emit('update', vModelValue)
      } else {
        if ($input && localValue !== $input.value) {
          $input.value = localValue
        }
      }

      if (isLast) {
        position = localValue.length
      }

      if (this.mask && $input === document.activeElement) {
        let digit = value[position - 1]

        while (
          position < localValue.length &&
          localValue.charAt(position - 1) !== digit
        ) {
          position++
        }

        this.$nextTick(() => {
          // setSelectionRange after $input.value = localValue
          $input.setSelectionRange(position, position)
        })
      }
    },
    formatLocal(value, last = false) {
      return mask(toString(value), this.mask, true, last)
    },
    parseModel(value) {
      return mask(value, this.mask, this.masked)
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
      this.$emit('input', this.vModelValue)
    },
    onChange(evt) {
      // Exit when prevented the input event
      if (evt.defaultPrevented) {
        stopEvent(evt, { propagation: false })
        return
      }
      const value = evt.target.value
      this.updateValue(value)
      this.$emit('change', this.vModelValue)
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
