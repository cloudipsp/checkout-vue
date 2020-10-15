import isMounted from '@/mixins/is_mounted'
import id from '@/mixins/id'
import { isExist } from '@/utils/typeof'
import { mapState } from '@/utils/store'
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
  },
  data() {
    return {
      innerValue: '',
    }
  },
  computed: {
    ...mapState(['css']),
    _id() {
      return this.$attrs.id || this.id
    },
    error() {
      if (!this.isMounted) return null
      const error = Object.values(this.$refs.validation.failedRules)[0]
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
    rules() {
      return this.$attrs.rules
    },
    classInput() {
      return [this.css.fc, this.inputClass]
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
