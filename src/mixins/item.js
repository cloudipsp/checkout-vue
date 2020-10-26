import isMounted from '@/mixins/is_mounted'
import id from '@/mixins/id'
import { isExist } from '@/utils/typeof'
import { errorHandler } from '@/utils/helpers'

export default {
  inheritAttrs: false,
  inject: ['submit'],
  mixins: [isMounted, id],
  props: {
    value: {
      type: [String, Number, Boolean],
      default: null,
    },
    inputClass: {
      type: String,
      default: '',
    },
    rules: {
      type: String,
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
    _id() {
      const id = this.$attrs.id ? this.$attrs.id.replace(/^f-/, '') : ''
      return 'f-' + (id || this.$attrs.name || this.id)
    },
    error() {
      if (!this.isMounted) return null
      const error = this.$refs.validation.messages[0]
      this.$emit('error', error)
      return error
    },
    attrs() {
      return {
        ...this.$attrs,
        id: this._id,
        state: this.state,
        placeholder: this.placeholder,
      }
    },
    attrsValidation() {
      return {
        // Identifier used for target/cross-field based rules.
        vid: this._id,
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
      this.innerValue = this.value
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
