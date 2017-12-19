import store from '@/store'
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
    recurring: {
      type: Boolean,
      default: false
    },
    value: String
  },
  data () {
    return {
      css: store.state.css,
      options: store.state.options,
      name_: 'f-' + this.name,
      field_: this.field || this.name
    }
  },
  created: function () {
    if(this.custom) {
      this.form = store.state.form.custom
    } else
    if (this.recurring) {
      this.form = store.state.form.recurring_data
    } else {
      this.form = store.state.form
    }
    if(this.value) {
      this.form[this.field_] = this.value
    }
  },
  computed: {
    label_: function () {
      return this.$t(this.label || this.name)
    },
    hasError: function () {
      return this.errors.has(this.name_) && this.$validator.flags[this.name_].touched
    }
  },
  // methods: {
  //   onEnter: function () {
  //     this.$root.$emit('submit')
  //     @keyup.enter="onEnter"
  //   }
  // },
  components: {
    Tooltip,
    TheMask
  }
}
