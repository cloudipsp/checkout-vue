<template>
  <div class="f-pay-button f-block">
    <div class="f-block-sm">
      <f-button-pay></f-button-pay>
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
import FButtonPay from '@/components/button-pay'

export default {
  components: {
    FButtonPay,
  },
  computed: {
    method: function() {
      return this.router.method
    },
  },
  methods: {
    cancel: function() {
      if (this.store.state.loading) return
      this.store.formLoading(true)
      sendRequest('api.checkout.order', 'get', this.params)
        .finally(() => {
          this.store.formLoading(false)
        })
        .then(this.location, this.location)
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
    location: function(model) {
      if (!model.submitToMerchant()) {
        location.assign(this.options.link)
      }
    },
  },
}
</script>
