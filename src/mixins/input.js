import store from '@/store'
import Tooltip from '@/components/tooltip'
import {TheMask} from 'vue-the-mask'

export default {
  props: {
    form: {
      type: Object,
      default: function () {
        return store.state.form
      }
    },
    name: {
      type: String,
      required: true
    },
    field: String,
    label: String,
    validate: [String, Object],
    placement: String,
    placeholder: String
  },
  data () {
    return {
      css: store.state.css,
      options: store.state.options,
      name_: 'f-' + this.name,
      field_: this.field || this.name
    }
  },
  computed: {
    label_: function () {
      return this.$t(this.label || this.name)
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
