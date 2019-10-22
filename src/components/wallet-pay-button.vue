<template>
  <div
    v-if="show"
    class="f-wallet-pay-button"
    :class="{ 'f-block-hr': isTop, 'f-block': isTop || isMenu }"
  >
    <slot :open="open">
      <div :class="{ 'f-block-sm': !isMenu && isTop }">
        <button
          :class="[$css.btn, 'f-btn-' + theme]"
          :style="style"
          class="f-btn-block"
          @click="open"
        >
          <span v-if="text" v-t="icon"></span>
          <f-svg :name="icon" size="2x"></f-svg>
        </button>
      </div>
    </slot>
  </div>
</template>

<script>
import { sendRequest } from '@/utils/helpers'

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
      icon: '',
      canMakePayment: false,
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
  },
  created() {
    if (!this.canRequest) return

    Promise.all([
      sendRequest('api.checkout.kkh', 'get'),
      sendRequest('api.checkout.pay', 'get', this.store.formParams(), {
        cached: true,
        clear: true,
        params: {},
      }),
    ])
      .then(([kkh, model]) => {
        this.config = model.data
        this.initRequest()
        if (!this.request) return
        this.initIcon(kkh)
        this.initCanMakePayment()
      })
      .catch(() => {})
  },
  methods: {
    initIcon(browser) {
      const os = browser.data.platform_os // ios android linux
      const type = browser.data.platform_type // desktop mobile
      const name = browser.data.platform_name // chrome safari
      const map = {
        safari: 'apple',
        chrome: 'google',
        ios: 'apple',
        android: 'google',
      }
      this.icon = (map[type === 'desktop' ? name : os] || 'google') + '_pay'
    },
    initRequest() {
      this.config.methods.push({
        supportedMethods: 'basic-card',
        data: { supportedNetworks: ['visa', 'mastercard', 'amex', 'discover'] },
      })
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
      this.request
        .canMakePayment()
        .then(result => {
          console.log('can.makePayment', result)

          this.canMakePayment = true
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
      }).then(session => {
        event.complete(session.data)
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
