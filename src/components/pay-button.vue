<template>
  <div class="f-pay-button f-block">
    <div class="f-block-sm">
      <button
        v-if="options.button"
        type="button"
        :class="[$css.btn, $css.bs, $css.btnLg, 'f-btn-block', $css.submit]"
        :disabled="disabled"
        @click="submit"
      >
        <span v-t="{ path: 'pay', args: args }" />
      </button>
      <f-wallet-pay-button
        position="bottom"
        :tab="method"
      ></f-wallet-pay-button>
      <a
        v-if="options.cancel"
        v-t="'cancel'"
        :class="[$css.btn, 'f-btn-link', 'f-btn-block']"
        href=""
        @click.prevent="cancel"
      />
      <div class="f-hidden-desktop">
        <i class="f-icon f-icon-block f-i-security" />
      </div>
    </div>
  </div>
</template>

<script>
import { sendRequest } from '@/utils/helpers'

export default {
  inject: ['$validator'],
  data() {
    return {}
  },
  computed: {
    disabled: function() {
      return !!this.errors.items.length && this.store.state.submit
    },
    fullAmount: function() {
      let amount = parseInt(this.params.amount)
      let amountWithFee = parseInt(this.params.amount_with_fee)
      if (!amount) {
        return false
      }
      return (amountWithFee || amount) / 100
    },
    args: function() {
      return this.fullAmount
        ? [this.fullAmount, this.$t(this.params.currency)]
        : []
    },
    method: function() {
      return this.router.method
    },
  },
  methods: {
    submit: function() {
      this.$root.$emit('submit')
    },
    cancel: function() {
      if (this.store.state.loading) return
      this.store.formLoading(true)
      sendRequest('api.checkout.order', 'get', this.params)
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.location, this.location)
    },
    location: function(model) {
      if (!model.submitToMerchant()) {
        location.assign(this.options.link)
      }
    },
  },
}
</script>
