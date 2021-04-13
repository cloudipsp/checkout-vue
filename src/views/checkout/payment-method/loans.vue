<template>
  <f-bank
    type="loans"
    :config="config"
    logo="id"
    :enable-country="false"
    @system="system"
  />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/payment-method/bank'
import { errorHandler } from '@/utils/helpers'

export default {
  components: {
    FBank,
  },
  inject: ['submit'],
  computed: {
    ...mapState('tabs', ['loans']),
    config() {
      return this.loans?.payment_systems || {}
    },
  },
  methods: {
    system(payment_system) {
      this.submit({ payment_system }).catch(errorHandler)
    },
  },
}
</script>
