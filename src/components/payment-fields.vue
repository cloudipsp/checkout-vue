<template>
  <fields v-if="show" class="f-payment-fields" />
</template>

<script>
import { mapState } from '@/utils/store'

export default {
  components: {
    fields: {
      template: '#f-fields',
    },
  },
  computed: {
    ...mapState(['need_verify_code']),
    ...mapState('options', ['fields']),
    show() {
      return this.fields && !this.need_verify_code
    },
  },
}
</script>
