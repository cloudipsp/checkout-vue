<template>
  <f-bank type="banklinks_eu" :config="config" logo="bank_logo" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('tabs', ['banklinks_eu']),
    config() {
      return (this.banklinks_eu && this.banklinks_eu.payment_systems) || {}
    },
  },
}
</script>
