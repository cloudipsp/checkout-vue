<template>
  <f-bank
    type="banklinks_eu"
    :config="config"
    logo="bank_logo"
    @system="system"
  />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/payment-method/bank'

export default {
  components: {
    FBank,
  },
  computed: {
    ...mapState('tabs', ['banklinks_eu']),
    config() {
      return this.banklinks_eu?.payment_systems || {}
    },
  },
  methods: {
    system(system) {
      this.$router
        .push({ name: 'system', params: { method: 'banklinks_eu', system } })
        .catch(() => {})
    },
  },
}
</script>
