<template>
  <f-bank :config="config" />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/method/bank'

export default {
  components: {
    FBank,
  },
  computed: {
    ...mapState('tabs', ['emoney']),
    config() {
      return this.emoney || {}
    },
  },
}
</script>
