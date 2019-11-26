<template>
  <button
    v-if="show"
    type="button"
    :class="className"
    :disabled="disabled"
    @click="submit"
  >
    <span v-t="{ path: 'pay', args: args }" />
  </button>
</template>

<script>
export default {
  inject: ['$validator'],
  data() {
    return {}
  },
  computed: {
    show() {
      return this.store.state.options.button
    },
    className() {
      return [
        this.$css.btn,
        this.$css.bs,
        this.$css.btnLg,
        'f-btn-block',
        this.$css.submit,
        'f-button-pay',
      ]
    },
    disabled() {
      return !!this.errors.items.length && this.store.state.submit
    },
    fullAmount() {
      let amount = parseInt(this.store.state.params.amount)
      let amountWithFee = parseInt(this.store.state.params.amount_with_fee)
      if (!amount) {
        return false
      }
      return (amountWithFee || amount) / 100
    },
    args() {
      return this.fullAmount
        ? [this.fullAmount, this.$t(this.store.state.params.currency)]
        : []
    },
  },
  methods: {
    submit() {
      this.$root.$emit('submit')
    },
  },
}
</script>
