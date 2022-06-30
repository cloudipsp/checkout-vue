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
  inject: ['submit'],
  computed: {
    ...mapState('tabs', ['loans']),
    config() {
      return this.loans || {}
    },
  },
}
</script>
