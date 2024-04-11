<template>
  <click2pay-user-exists-success-page v-if="show" />
</template>

<script>
import { Click2payUserExistsSuccessPage, loadClick2pay } from '@/import'
import { mapState } from '@/utils/store'
import { consoleInfo } from '@/utils/console'

export default {
  components: {
    Click2payUserExistsSuccessPage,
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
        .then(({ isUserExists }) => isUserExists())
        .then(() => {
          this.show = true
        })
        .catch(error => {
          consoleInfo('Click to Pay user-exists-success-page', error)
        })
    },
    isEnabled() {
      return this.order_data.click2pay_checkout_data
        ? Promise.resolve()
        : Promise.reject('not order_data.click2pay_checkout_data')
    },
  },
}
</script>
