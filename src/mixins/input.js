import store from '@/store'
import Tooltip from '@/components/tooltip'

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
      required: true,
      default: function () {
        return 'f-' + this.name
      }
    },
    field: String,
    label: String,
    validate: [String, Object],
    placement: String,
    placeholder: String
  },
  data () {
    return {
      name_: 'f-' + this.name,
      field_: this.field || this.name
    }
  },
  components: {
    Tooltip
  }
}
