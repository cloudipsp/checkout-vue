import { loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
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
      const name = 'Click to Pay otp'
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (!this.store.enabledClick2pay()) return
      console.time(name)

      loadClick2pay()
        .then(({ needOtp }) => needOtp(this.email))
        .then(() => {
          console.timeEnd(name)
          this.$router.push({ name: 'click2pay_otp' }).catch(() => {})
        })
        .catch(error => {
          consoleInfo(name, error)
        })
    },
  },
  render() {},
}
