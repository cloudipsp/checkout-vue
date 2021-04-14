<template>
  <f-subscription v-if="show" />
</template>

<script>
import { mapState } from '@/utils/store'
import { FSubscription } from '@/import'

export default {
  components: {
    FSubscription,
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('subscription', ['enabled']),
    ...mapState('params', ['token']),
    show() {
      return this.enabled && (this.token ? this.ready : true)
    },
  },
}
</script>
