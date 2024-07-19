import { isMountedMixin } from '@/mixins/is-mounted'
import { idMixin, props as idProps } from '@/mixins/id'
import { isExist } from '@/utils/inspect'
import { errorHandler } from '@/utils/helpers'
import {
  PROP_TYPE_STRING_NUMBER_BOOLEAN,
  PROP_TYPE_STRING,
  PROP_TYPE_OBJECT_STRING,
} from '@/constants/props'
import { makeProp } from '@/utils/props'
import { arrayIncludes } from '@/utils/array'
import { attemptFocus, isActiveElement } from '@/utils/dom'
import { mapState } from '@/utils/store'

// @vue/component
export const itemMixin = {
  mixins: [isMountedMixin, idMixin],
  inject: ['submit'],
  inheritAttrs: false,
  props: {
    ...idProps,
    vid: makeProp(PROP_TYPE_STRING),
    value: makeProp(PROP_TYPE_STRING_NUMBER_BOOLEAN),
    inputClass: makeProp(PROP_TYPE_STRING),
    rules: makeProp(PROP_TYPE_OBJECT_STRING, {}),
    size: makeProp(PROP_TYPE_STRING, undefined, value =>
      arrayIncludes(['sm', '48'], value)
    ),
    variant: makeProp(PROP_TYPE_STRING, 'default', value =>
      arrayIncludes(['default', 'secondary'], value)
    ),
  },
  data() {
    return {
      innerValue: '',
    }
  },
  computed: {
    ...mapState(['isSubmit']),
    error() {
      if (!this.isMounted) return null
      return this.$refs.validation.errors[0]
    },
    touched() {
      if (!this.isMounted) return
      return this.$refs.validation.flags.touched
    },
    hasError() {
      return this.error && (this.touched || this.isSubmit)
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
        vid: this.vid,
        // A string that will be used to replace {field} in error messages and for custom error messages.
        name: this.vid,
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
        `f-form-control-${this.variant}`,
        this.inputClass,
        {
          ['f-control-' + this.size]: this.size,
          'f-control-error': this.hasError,
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
    focused() {
      if (isActiveElement(this.$refs.input.$el)) return

      attemptFocus(this.$refs.input.$el)
    },
  },
}
