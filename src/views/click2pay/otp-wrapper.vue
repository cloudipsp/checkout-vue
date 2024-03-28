<template>
  <div />
</template>

<script>
import { loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState(['ready']),
    ...mapState('params', ['email']),
    ...mapState('info', ['click2pay_init_enabled']),
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
      if (!this.click2pay_init_enabled) return

      loadClick2pay()
        .then(({ needOtp }) => needOtp(this.email))
        .then(() => {
          this.$router.push({ name: 'click2pay_otp' }).catch(() => {})
        })
        .catch(error => {
          console.warn('Click to Pay needOtp', error)
        })
    },
  },
}
</script>
