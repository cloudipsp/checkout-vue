<template>
  <f-bank type="loans" :config="config" :is-bank="false" logo="id" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  computed: {
    ...mapState('tabs', ['loans']),
    config() {
      return (this.loans && this.loans.payment_systems) || {}
    },
  },
}
</script>
