<template>
  <f-button-cancel v-if="order?.cancel_url" />
</template>

<script>
import { FButtonCancel } from '@/import'
import { mapState } from '@/utils/store'

export default {
  components: {
    FButtonCancel,
  },
  computed: {
    ...mapState('info', ['order']),
  },
}
</script>
