import { isMountedMixin } from '@/mixins/is-mounted'
import { idMixin, props as idProps } from '@/mixins/id'
import { isExist } from '@/utils/inspect'
import { errorHandler } from '@/utils/helpers'

// @vue/component
export const itemMixin = {
  mixins: [isMountedMixin, idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    inputClass: {
      type: String,
      default: '',
    },
    rules: {
      type: [Object, String],
      default: '',
    },
    size: {
      type: String,
      default: '',
      validator: value => ['', 'sm'].includes(value),
    },
  },
  data() {
    return {
      innerValue: '',
    }
  },
  computed: {
    error() {
      if (!this.isMounted) return null
      return this.$refs.validation.errors[0]
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this.safeId(),
        state: this.state,
        placeholder: this.placeholder,
      }
    },
    attrsValidation() {
      return {
        // Identifier used for target/cross-field based rules.
        vid: this.$attrs.name,
        // A string that will be used to replace {field} in error messages and for custom error messages.
        name: this.$attrs.name,
        rules: this.rules,
        immediate: true,
        tag: 'div',
      }
    },
    state() {
      return this.error ? false : null
    },
    classInput() {
      return [
        'f-form-control',
        this.inputClass,
        {
          ['f-control-' + this.size]: this.size,
        },
      ]
    },
    placeholder() {
      return this.$t(this.$attrs.placeholder)
    },
  },
  watch: {
    innerValue: 'watchInnerValue',
    value: 'watchValue',
  },
  created() {
    if (isExist(this.value)) {
      this.watchValue(this.value)
    }
  },
  methods: {
    watchInnerValue(newValue) {
      this.$emit('input', newValue)
    },
    watchValue(newValue) {
      this.innerValue = newValue
    },
    onEnter() {
      this.submit().catch(errorHandler)
    },
  },
}
