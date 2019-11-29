export default {
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
      default: '',
    },
  },
  computed: {
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
    hasError() {
      return (
        this.errors.has(this.name_) &&
        (this.flag.touched || this.store.state.submit)
      )
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
      this.$root.$emit('submit')
    },
  },
}
