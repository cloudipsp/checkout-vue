<template>
  <f-alert-gdpr v-if="show" />
</template>

<script>
import { mapState, localStorage, sessionStorage } from '@/utils/store'
import { FAlertGdpr } from '@/import'

const name = 'show_gdpr_frame'

export default {
  components: {
    FAlertGdpr,
  },
  computed: {
    ...mapState([name]),
    show() {
      return !localStorage.get(name) && !sessionStorage.get(name) && this[name]
    },
  },
}
</script>
