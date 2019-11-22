<template>
  <fields v-if="show" class="f-payment-fields"></fields>
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
  computed: {
    show() {
      return (
        this.store.state.options.fields && !this.store.state.need_verify_code
      )
    },
  },
}
</script>
