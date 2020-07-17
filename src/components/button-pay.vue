<template>
  <button
    v-if="show"
    type="button"
    :class="className"
    :disabled="disabled"
    @click="click"
  >
    <span v-t="{ path: 'pay', args: args }" />
  </button>
</template>

<script>
import { mapState } from '@/utils/store'
export default {
  inject: ['$validator'],
  computed: {
    ...mapState(['css', 'submit']),
    ...mapState('options', { show: 'button' }),
    ...mapState('params', ['amount', 'amount_with_fee', 'currency']),
    ...mapState('css_variable', [
      'btn_success_gradient_enable',
      'btn_success_gradient_custom',
    ]),
    className() {
      return [
        this.css.btn,
        this.css.bs,
        this.css.btnLg,
        'f-btn-block',
        this.css.submit,
        'f-button-pay',
        {
          'f-btn-gradient':
            this.btn_success_gradient_enable &&
            !this.btn_success_gradient_custom,
          'f-btn-gradient-custom':
            this.btn_success_gradient_custom &&
            !this.btn_success_gradient_enable,
        },
      ]
    },
    disabled() {
      return !!this.errors.items.length && this.submit
    },
    fullAmount() {
      if (!this.amount) {
        return false
      }
      return (this.amount_with_fee || this.amount) / 100
    },
    args() {
      return this.fullAmount ? [this.fullAmount, this.$t(this.currency)] : []
    },
  },
  methods: {
    click() {
      this.$root.$emit('submit')
    },
  },
}
</script>
