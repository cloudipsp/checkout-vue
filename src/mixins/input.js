import { mapState } from '@/utils/store'
import { errorHandler } from '@/utils/helpers'

export default {
  inheritAttrs: false,
  inject: ['$validator', 'submit'],
  props: {
    name: {
      type: String,
      required: true,
    },
    field: {
      type: String,
      default: '',
    },
    label: {
      type: String,
      default: '',
    },
    labelClass: {
      type: String,
      default: 'f-control-label-p',
    },
    validate: {
      type: [String, Object],
      default: null,
    },
    placement: {
      type: String,
      default: undefined,
    },
    placeholder: {
      type: String,
      default: '',
    },
    custom: Boolean,
    // eslint-disable-next-line vue/prop-name-casing
    customer_data: Boolean,
    recurring: Boolean,
    model: {
      type: Object,
      default: null,
    },
    value: {
      type: String,
      default: '',
    },
    inputmode: {
      type: String,
      default: null,
    },
    readonly: Boolean,
    autocomplete: {
      type: String,
      default: null,
    },
    tooltip: {
      type: Boolean,
      default: false,
    },
    inputClass: {
      type: String,
      default: null,
    },
    prepend: {
      type: String,
      default: null,
    },
    hideError: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      focused: false,
      hover: false,
      showErrorTooltipFlag: false,
    }
  },
  computed: {
    ...mapState(['css', 'isSubmit']),
    name_() {
      return 'f-' + this.name
    },
    field_() {
      return this.field || this.name
    },
    label_() {
      return this.$t(this.label || this.name)
    },
    placeholder_() {
      return this.$t(this.placeholder)
    },
    flag() {
      return this.$validator.flags[this.name_] || {}
    },
    isError() {
      return this.errors.has(this.name_)
    },
    hasError() {
      return this.isError && (this.flag.touched || this.isSubmit)
    },
    showErrorTooltip() {
      let result = this.tooltip && this.hasError && this.focused
      this.showErrorTooltipFlag = result
      return result
    },
    showError() {
      let showError = !this.tooltip && this.hasError && this.focused
      this.$emit('show-error', showError, this.errors.first(this.name_))
      return showError && !this.hideError
    },
    value_: {
      get() {
        return this.params[this.field_]
      },
      set(v) {
        this.params[this.field_] = v
      },
    },
    classReadonly() {
      return { 'f-form-control-text': this.readonly }
    },
    classError() {
      return this.hasError ? this.css.ie : ''
    },
    className() {
      return [this.css.fc, this.classReadonly, this.classError, this.inputClass]
    },
    classLabel() {
      return [
        this.css.cl,
        this.labelClass,
        this.hasError ? this.css.le : '',
        { 'f-control-label-active': this.params[this.field_] || this.focused },
        { 'f-control-label-hover': this.hover },
        { 'f-control-label-focused': this.focused },
      ]
    },
    classGroupName() {
      return ['f-form-group', this.hasError ? this.css.he : '']
    },
  },
  created() {
    if (this.model) {
      this.params = this.model
    } else if (this.custom) {
      this.params = this.store.state.params.custom
    } else if (this.recurring) {
      this.params = this.store.state.params.recurring_data
    } else if (this.customer_data) {
      this.params = this.store.state.params.customer_data
    } else {
      this.params = this.store.state.params
    }
    if (this.value) {
      this.params[this.field_] = this.value
    }
  },
  methods: {
    onEnter() {
      this.submit().catch(errorHandler)
    },
    focus() {
      this.focused = true
    },
    blur() {
      this.focused = false
    },
    mouseenter() {
      this.hover = true
    },
    mouseleave() {
      this.hover = false
    },
  },
}
