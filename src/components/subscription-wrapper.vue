<template>
  <f-subscription v-if="show" />
</template>

<script>
import { mapState, mapStateGetSet } from '@/utils/store'
import { FSubscription } from '@/import'

export default {
  components: {
    FSubscription,
  },
  computed: {
    ...mapState(['ready']),
    ...mapState('subscription', ['enabled', 'show']),
    ...mapState('subscription', { showSubscription: 'show' }),
    ...mapState('params', ['token']),
    ...mapStateGetSet('params', ['recurring']),
    show() {
      return this.showSubscription && (this.token ? this.ready : true)
    },
  },
  watch: {
    enabled: {
      handler(value) {
        this.recurring = value ? 'y' : 'n'
      },
      immediate: true,
    },
  },
}
</script>
