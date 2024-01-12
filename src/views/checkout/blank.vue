<template>
  <div>
    <f-mode v-if="showMode" />
    <router-view />
  </div>
</template>

<script>
import { FMode } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FMode,
  },
  computed: {
    ...mapState(['mode_test']),
    ...mapState('options', ['disable_request']),
    showMode() {
      return this.disable_request || this.mode_test
    },
  },
}
</script>
