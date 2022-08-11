<template>
  <f-alert-storage name="show_gdpr_yapily">
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="$t('gdpr_yapily')" />
  </f-alert-storage>
</template>

<script>
import FAlertStorage from '@/components/alert/alert-storage'

export default {
  components: {
    FAlertStorage,
  },
}
</script>
