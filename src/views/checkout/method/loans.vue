<template>
  <f-bank :config="config" :enable-country="false" @system="system" />
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
    ...mapState('tabs', ['loans']),
    config() {
      return this.loans || {}
    },
  },
  methods: {
    system(payment_system) {
      this.submit({ payment_system }).catch(errorHandler)
    },
  },
}
</script>
