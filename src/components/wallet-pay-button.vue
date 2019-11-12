<template>
  <div
    v-if="show"
    class="f-wallet-pay-button"
    :class="{ 'f-block-hr': isTop, 'f-block': isTop || isMenu }"
  >
    <slot :open="open">
      <div class="f-text-center" :class="{ 'f-block-sm': !isMenu && isTop }">
        <button
          :class="[$css.btn, $css.btnLg, 'f-btn-' + theme, 'f-btn-' + icon]"
          :style="style"
          class="f-btn-pay f-btn-block"
          @click="open"
        >
          <span v-if="text" v-t="icon"></span>
          <f-svg :name="icon"></f-svg>
        </button>
      </div>
    </slot>
  </div>
</template>

<script>
import { sendRequest, isSafari } from '@/utils/helpers'

export default {
  props: {
    position: {
      type: String,
      default: '',
    },
    tab: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      icon: isSafari() ? 'apple_pay' : 'google_pay',
      canMakePayment: false,
      timeout: null,
      time: null,
    }
  },
  computed: {
    canRequest() {
      return (
        this.position === this.options.wallet_pay_button[this.tab].position &&
        this.options.wallet_pay_button[this.tab].display
      )
    },
    show() {
      return this.canMakePayment && this.canRequest
    },
    isTop() {
      return this.position === 'top'
    },
    isBottom() {
      return this.position === 'bottom'
    },
    isMenu() {
      return this.tab === 'menu'
    },
    theme() {
      return this.options.wallet_pay_button[this.tab].theme
    },
    style() {
      return !this.isMenu && this.isBottom
        ? {
            marginTop: '20px',
          }
        : {}
    },
    text() {
      return this.options.wallet_pay_button[this.tab].text
    },
    amount() {
      return this.store.state.params.amount
    },
  },
  watch: {
    amount() {
      if (!this.show) return

      clearTimeout(this.timeout)

      this.timeout = setTimeout(this.sendRequest, 100)
    },
  },
  created() {
    if (!this.canRequest) return

    this.sendRequest()
      .then(this.initCanMakePayment)
      .catch(e => {
        if (e instanceof Error) console.log(e)
      })
  },
  methods: {
    sendRequest() {
      let time = new Date().getTime()
      return sendRequest('api.checkout.pay', 'get', this.store.formParams(), {
        cached: true,
        clear: true,
        params: {},
      }).then(({ data }) => {
        if (this.time > time) return Promise.reject()
        this.time = time

        this.config = data
        this.initRequest()
      })
    },
    initRequest() {
      try {
        this.request = new PaymentRequest(
          this.config.methods,
          this.config.details,
          this.config.options
        )
        // TODO нада off ети подписки?
        this.request.addEventListener(
          'merchantvalidation',
          this.merchantValidation
        )
        this.request.addEventListener(
          'paymentmethodchange',
          this.paymentMethodChange
        )
        this.request.addEventListener(
          'shippingaddresschange',
          this.shippingAddressChange
        )
        this.request.addEventListener(
          'shippingoptionchange',
          this.shippingOptionChange
        )
      } catch (e) {}
    },
    initCanMakePayment() {
      if (!this.request) return

      this.request
        .canMakePayment()
        .then(result => {
          console.log('can.makePayment', result)

          this.canMakePayment = result
        })
        .catch(() => {
          console.log('can.makePayment', 'catch error', arguments)
        })
    },
    open() {
      this.request
        .show()
        .then(this.callback)
        .then(this.success)
        .then(this.close)
        .catch(this.close)
    },
    callback(response) {
      this.response = response
      return this.response.complete('success')
    },
    success() {
      return sendRequest('api.checkout.form', 'request', {
        payment_system: this.config.payment_system,
        data: this.response.details,
      })
    },
    close(...args) {
      console.log(args[0].message)
      this.initRequest()
    },
    shippingOptionChange(event) {
      let request = event.target
      let option = this.config.details.shippingOptions.find(option => {
        if (option.id === request.shippingOption) {
          return option
        }
      })
      this.config.details.displayItems.push(option)
      event.updateWith(this.config.details)
    },
    merchantValidation(event) {
      this.appleSession({
        url: event.validationURL,
        domain: location.host,
        merchant_id: this.store.state.params.merchant_id,
      })
        .then(session => {
          event.complete(session.data)
        })
        .catch(e => {
          if (e instanceof Error) console.log(e)
        })
    },
    appleSession(data) {
      return sendRequest('api.checkout.pay', 'session', data)
    },
    paymentMethodChange(event) {
      console.log('fire event', event.type)
      event.updateWith(this.config.details)
    },
    shippingAddressChange(event) {
      console.log('fire event', event.type, event.target)
      event.updateWith(this.config.details)
    },
  },
}
</script>
