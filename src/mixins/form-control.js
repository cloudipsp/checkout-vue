import {
  attemptFocus,
  isVisible,
  matches,
  requestAF,
  select,
} from '@/utils/dom'

const SELECTOR = 'input, textarea, select'

export const props = {
  disabled: {
    type: Boolean,
    default: false,
  },
  required: {
    type: Boolean,
    default: false,
  },
  autofocus: {
    type: Boolean,
    default: false,
  },
}

// @vue/component
export const formControlMixin = {
  props,
  mounted() {
    this.handleAutofocus()
  },
  activated() {
    this.handleAutofocus()
  },
  methods: {
    handleAutofocus() {
      this.$nextTick(() => {
        requestAF(() => {
          let el = this.$el
          if (this.autofocus && isVisible(el)) {
            if (!matches(el, SELECTOR)) {
              el = select(SELECTOR, el)
            }
            attemptFocus(el)
          }
        })
      })
    },
  },
}
