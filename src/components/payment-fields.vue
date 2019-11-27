<template>
  <fields v-if="show" class="f-payment-fields"></fields>
</template>

<script>
export default {
  components: {
    fields: {
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
