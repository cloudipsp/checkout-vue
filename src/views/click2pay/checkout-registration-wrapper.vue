<template>
  <click2pay-checkout-registration
    v-if="show"
    :disabled="disabled"
    @enable="enable"
  />
</template>

<script>
import { Click2payCheckoutRegistration, loadClick2pay } from '@/import'
import { mapState, mapStateGetSet } from '@/utils/store'
import { timeoutMixin } from '@/mixins/timeout'
import { validate } from 'vee-validate'

export default {
  components: {
    Click2payCheckoutRegistration,
  },
  mixins: [timeoutMixin],
  data() {
    return {
      show: false,
      disabled: false,
      readonlyEmail: false,
    }
  },
  computed: {
    ...mapState(['ready']),
    ...mapStateGetSet('options', { showEmail: 'email' }),
    ...mapState('params', ['email']),
    ...mapState('info', ['click2pay_checkout_registration_enabled']),
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

      this.initRegistration()
    },
    initRegistration() {
      if (
        !(
          this.click2pay_checkout_registration_enabled &&
          (this.showEmail || this.email)
        )
      )
        return

      if (!this.showEmail) {
        this.showEmail = true
        this.readonlyEmail = true
      }
      this.show = true

      this.checkRegistration()
    },
    checkRegistration() {
      this.validate()
        .then(() => loadClick2pay())
        .then(({ needRegistration }) => needRegistration(this.email))
        .then(() => {
          this.show = true
        })
        .catch(error => {
          console.warn('Click to Pay needRegistration', error)
          this.show = false
          this.enable(false)
        })
    },
    validate() {
      return validate(this.email, 'required|email').then(({ valid }) => {
        this.disabled = !valid

        if (!valid) return Promise.reject()
      })
    },
    watchEmail() {
      this.timeout('checkRegistration', 300)
    },
    enable(value) {
      this.$emit('enable', this.readonlyEmail || value)
    },
  },
}
</script>
