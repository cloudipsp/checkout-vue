<template>
  <f-bank type="local_methods" :config="config" logo="bank_logo" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('tabs', ['local_methods']),
    config() {
      return (this.local_methods && this.local_methods.payment_systems) || {}
    },
  },
}
</script>
