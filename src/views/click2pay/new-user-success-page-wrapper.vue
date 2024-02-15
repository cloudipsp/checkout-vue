<template>
  <click2pay-new-user-success-page v-if="show" />
</template>

<script>
import { Click2payNewUserSuccessPage, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payNewUserSuccessPage,
  },
  data() {
    return {
      show: false,
    }
  },
  computed: {
    ...mapState('order', ['order_data']),
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      if (!this.store.enabledClick2pay()) return

      this.isEnabled()
        .then(loadClick2pay)
        .then(({ needRegistration }) =>
          needRegistration(this.order_data.sender_email)
        )
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay new-user-success-page', error)
        })
    },
    isEnabled() {
      return this.store.enabledClick2paySuccessPageRegistration()
        ? Promise.resolve()
        : Promise.reject(
            'not (click2pay_success_page_registration_enabled || order_data.click2pay_checkout_data)'
          )
    },
  },
}
</script>
