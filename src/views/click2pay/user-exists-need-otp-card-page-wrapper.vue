<template>
  <click2pay-user-exists-need-otp-card-page v-if="show" />
</template>

<script>
import { Click2payUserExistsNeedOtpCardPage, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payUserExistsNeedOtpCardPage,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('order', ['ready_to_submit']),
    ...mapState('params', ['email']),
  },
  watch: {
    ready: 'init',
    email: 'watchEmail',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (!this.store.enabledClick2pay()) return

      loadClick2pay()
        .then(({ needOtp }) => needOtp(this.email))
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay user-exists-need-otp-card', error)
          this.show = false
        })
    },
    watchEmail() {
      this.timeout('init', 300)
    },
  },
}
</script>
