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
    ...mapState('tabs', ['banklinks_eu']),
    config() {
      return this.banklinks_eu || {}
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
