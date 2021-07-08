<template>
  <f-bank :config="config" @system="system" />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/method/bank'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FBank,
  },
  inject: ['submit'],
  computed: {
    ...mapState('tabs', ['emoney']),
    config() {
      return this.emoney || {}
    },
  },
  methods: {
    system(payment_system) {
      this.submit({ payment_system }).catch(errorHandler)
    },
  },
}
</script>
