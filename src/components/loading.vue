<template>
  <component :is="component" v-bind="$attrs" />
</template>

<script>
import { FLoadingCustom, FLoadingDefault } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FLoadingCustom,
    FLoadingDefault,
  },
  computed: {
    ...mapState('options', { customLoading: 'loading' }),
    component() {
      if (this.customLoading) {
        return 'FLoadingCustom'
      } else {
        return 'FLoadingDefault'
      }
    },
  },
}
</script>
