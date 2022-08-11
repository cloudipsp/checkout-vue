<template>
  <f-alert-gdpr-yapily v-if="show" />
</template>

<script>
import { localStorage, sessionStorage } from '@/utils/store'
import { FAlertGdprYapily } from '@/import'

const name = 'show_gdpr_yapily'

export default {
  components: {
    FAlertGdprYapily,
  },
  computed: {
    show() {
      return !localStorage.get(name) && !sessionStorage.get(name)
    },
  },
}
</script>
