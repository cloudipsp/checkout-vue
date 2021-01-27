<script>
import { mapState } from '@/utils/store'

export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    custom: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapState(['params']),
  },
  created() {
    let form = this.custom ? this.params.custom : this.params
    form[this.name] = form[this.name] || this.value
  },
  render(h) {
    return h()
  },
}
</script>
