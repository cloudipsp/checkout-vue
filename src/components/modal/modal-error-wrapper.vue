<template>
  <f-modal-error v-if="showInner" />
</template>

<script>
import { FModalError } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FModalError,
  },
  data() {
    return {
      showInner: false,
    }
  },
  computed: {
    ...mapState('error', ['show']),
  },
  watch: {
    show(value) {
      this.showInner = this.showInner || value
    },
  },
}
</script>
