<script>
import { mapState } from '@/utils/store'
import { PROP_TYPE_STRING, PROP_TYPE_BOOLEAN } from '@/constants/props'
import { makeProp } from '@/utils/props'

export default {
  props: {
    name: makeProp(PROP_TYPE_STRING, undefined, true),
    value: makeProp(PROP_TYPE_STRING, undefined, true),
    custom: makeProp(PROP_TYPE_BOOLEAN, false),
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
