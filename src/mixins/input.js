import Tooltip from '@/components/tooltip'
import {TheMask} from 'vue-the-mask'

export default {
  inject: ['$validator'],
  props: {
    name: {
      type: String,
      required: true
    },
    field: String,
    label: String,
    validate: [String, Object],
    placement: String,
    placeholder: String,
    custom: {
      type: Boolean,
      default: false
    },
    customer_data: {
      type: Boolean,
      default: false
    },
    recurring: {
      type: Boolean,
      default: false
    },
    model: {
      type: Object
    },
    value: String,
    inputmode: String,
    readonly: Boolean,
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
      return this.$t(this.placeholder)
    },
    flag() {
      return this.$validator.flags[this.name_]
    },
    hasError() {
      return this.errors.has(this.name_) && ((this.flag && this.flag.touched) || this.store.state.submit)
    },
    value_: {
      get(){
        return this.params[this.field_]
      },
      set(v){
        this.params[this.field_] = v
      }
    },
    classReadonly() {
      return this.readonly ? 'f-form-control-text' : ''
    }
  },
  created() {
    if(this.model) {
      this.params = this.model
    } else
    if(this.custom) {
      this.params = this.store.state.params.custom
    } else
    if (this.recurring) {
      this.params = this.store.state.params.recurring_data
    } else
    if (this.customer_data) {
      this.params = this.store.state.params.customer_data
    } else
    {
      this.params = this.store.state.params
    }
    if(this.value) {
      this.params[this.field_] = this.value
    }
  },
  methods: {
    onEnter() {
      this.$root.$emit('submit')
    }
  },
  components: {
    Tooltip,
    TheMask
  }
}
