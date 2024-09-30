import { loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { makeProp } from '@/utils/props'
import { PROP_TYPE_BOOLEAN } from '@/constants/props'

export default {
  props: {
    value: makeProp(PROP_TYPE_BOOLEAN, false),
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('order', ['ready_to_submit']),
    ...mapState('params', ['email']),
  },
  watch: {
    ready: 'init',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (!this.store.enabledClick2pay()) return
      this.$emit('input', true)

      loadClick2pay()
        .then(({ loading }) => loading(this.email))
        .then(() => {
          this.$emit('input', false)
        })
        .catch(() => {
          this.$emit('input', false)
        })
    },
  },
  render() {},
}
