<template>
  <fields
    v-if="options.fields && !store.state.need_verify_code"
    class="f-payment-fields"
  ></fields>
</template>

<script>
import InputText from '@/components/input-text'
import InputAmount from '@/components/input-amount'
import InputHidden from '@/components/input-hidden'

export default {
  components: {
    fields: {
      components: {
        InputText,
        InputAmount,
        InputHidden,
      },
      template: '#f-fields',
    },
  },
  data() {
    return {}
  },
}
</script>
