<template>
  <f-bank :config="config" @system="system" />
</template>

<script>
import { mapState } from '@/utils/store'
import FBank from '@/views/checkout/method/bank'

export default {
  components: {
    FBank,
  },
  computed: {
    ...mapState('tabs', ['local_methods']),
    config() {
      return this.local_methods?.payment_systems || {}
    },
  },
  methods: {
    system(system) {
      this.$router
        .push({ name: 'system', params: { method: 'local_methods', system } })
        .catch(() => {})
    },
  },
}
</script>
