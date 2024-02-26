<template>
  <click2pay-new-user-card-page v-if="show" @enable="enable" />
</template>

<script>
import { Click2payNewUserCardPage, loadClick2pay } from '@/import'
import { mapState, mapStateGetSet } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { validate } from 'vee-validate'
import { consoleInfo } from '@/utils/console'
import { getBinName } from '@/utils/get-bin-name'

export default {
  components: {
    Click2payNewUserCardPage,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      show: false,
      readonlyEmail: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('order', ['ready_to_submit']),
    ...mapStateGetSet('options', { showEmail: 'email' }),
    ...mapState('params', ['email', 'card_number']),
    ...mapState('info', ['click2pay_checkout_registration_enabled']),
    enabled() {
      return (
        this.click2pay_checkout_registration_enabled &&
        (this.showEmail || this.email)
      )
    },
  },
  watch: {
    ready: 'init',
    card_number: 'init',
    email: 'watchEmail',
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.ready) return
      if (this.ready_to_submit) return
      if (getBinName(this.card_number) !== 'visa') return
      if (!this.store.enabledClick2pay()) return
      if (!this.enabled)
        return consoleInfo(
          'Click to Pay new-user-card not click2pay_checkout_registration_enabled && (email || show_email)'
        )

      if (!this.showEmail) {
        this.showEmail = true
        this.readonlyEmail = true
        this.enable(true)
      }

      this.validate()
        .then(loadClick2pay)
        .then(({ needRegistration }) => needRegistration(this.email))
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay new-user-card', error)
          this.show = false
          this.enable(false)
        })
    },
    validate() {
      return validate(this.email, 'required|email').then(({ valid }) => {
        if (!valid) return Promise.reject('email is not valid')
      })
    },
    watchEmail() {
      this.timeout('init', 300)
    },
    enable(value) {
      this.$emit('enable', this.readonlyEmail || value)
    },
  },
}
</script>
