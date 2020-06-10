import { mapState } from '@/utils/store'

export default {
  inheritAttrs: false,
  inject: ['$validator'],
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
  },
  data() {
    return {
      active: false,
    }
  },
  computed: {
    ...mapState(['css', 'submit']),
    ...mapState('options', ['tooltip']),
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
      const key = this.name + '_p'

      return this.$te(key) ? this.$t(key) : this.$t(this.placeholder)
    },
    flag() {
      return this.$validator.flags[this.name_] || {}
    },
    isError() {
      return this.errors.has(this.name_)
    },
    hasError() {
      return this.isError && (this.flag.touched || this.submit)
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
      return [this.css.fc, this.classReadonly, this.classError]
    },
    classLabel() {
      return [
        this.css.cl,
        this.hasError ? this.css.le : '',
        { active: this.active },
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

    this.active = this.params[this.field_]
  },
  methods: {
    onEnter() {
      this.$root.$emit('submit')
    },
    focus() {
      this.active = true
    },
    blur() {
      this.active = this.params[this.field_]
    },
  },
}
