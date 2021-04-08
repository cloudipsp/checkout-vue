<template>
  <f-alert-gdpr v-if="show" v-model="showInner" />
</template>

<script>
import { mapState, localStorage, sessionStorage } from '@/utils/store'
import { FAlertGdpr } from '@/import'

export default {
  components: {
    FAlertGdpr,
  },
  data() {
    return {
      showInner: true,
    }
  },
  computed: {
    ...mapState(['show_gdpr_frame']),
    show() {
      return (
        !localStorage.get('show_gdpr_frame') &&
        !sessionStorage.get('show_gdpr_frame') &&
        this.show_gdpr_frame
      )
    },
  },
}
</script>
