<template>
  <f-alert-notification v-if="show" v-model="showInner" />
</template>

<script>
import { mapState } from '@/utils/store'
import { FAlertNotification } from '@/import'

export default {
  components: {
    FAlertNotification,
  },
  data() {
    return {
      showInner: true,
    }
  },
  computed: {
    ...mapState(['notification']),
    show() {
      return this.notification
    },
  },
  watch: {
    show(newVal) {
      this.showInner = !!newVal
    },
  },
}
</script>
